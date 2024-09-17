import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KortDataService } from './kort-data.service';

@Injectable({
  providedIn: 'root'
})
export class KortService {
  private allSlots = new BehaviorSubject<{ kort: number, time: string, isAvailable: boolean }[]>([]);
  allSlots$ = this.allSlots.asObservable();
  private rezervasyonlar: any[] = [];

  constructor(private kortDataService: KortDataService) { }

  loadAllKortSlots() {
    // Önce rezervasyon bilgilerini JSON'dan yükle
    this.kortDataService.getRezervasyonlar().subscribe(rezervasyonlar => {
      this.rezervasyonlar = rezervasyonlar.rezervasyonlar;

      // Daha sonra kort bilgilerini yükle
      this.kortDataService.getKortlar().subscribe(kortlar => {
        kortlar.kortlar.forEach((kort: { kort: number; startHour: number; endHour: number; }) => {
          this.loadKortSlots(kort.kort, kort.startHour, kort.endHour);
        });
      });
    });
  }

  private loadKortSlots(kortNumber: number, startHour: number, endHour: number) {
    const slots = this.generateTimeSlots(kortNumber, startHour, endHour);
    this.updateKortSlots(kortNumber, slots);
  }

  private generateTimeSlots(kortNumber: number, startHour: number, endHour: number) {
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({ 
        time: `${hour}:00`, 
        isAvailable: this.checkAvailability(kortNumber, `${hour}:00`),
        player: this.getPlayer(kortNumber, `${hour}:00`)  // Oyuncu bilgisi ekleniyor
      });
      slots.push({ 
        time: `${hour}:30`, 
        isAvailable: this.checkAvailability(kortNumber, `${hour}:30`),
        player: this.getPlayer(kortNumber, `${hour}:30`)  // Oyuncu bilgisi ekleniyor
      });
    }
    return slots;
  }
  private getPlayer(kortNumber: number, time: string): string | undefined {
    const reservation = this.rezervasyonlar.find(r => r.kort === kortNumber && r.time === time);
    return reservation ? reservation.player : undefined;
  }

  private checkAvailability(kortNumber: number, time: string): boolean {
    // Kort ve saat için rezervasyon yapılıp yapılmadığını kontrol et
    const reservation = this.rezervasyonlar.find(r => r.kort === kortNumber && r.time === time);
    return !reservation;  // Rezervasyon yoksa true (uygun), varsa false (dolu)
  }

  private updateKortSlots(kortNumber: number, slots: { time: string, isAvailable: boolean, player?: string }[]) {
    const kortSlots = slots.map(slot => ({
      kort: kortNumber,
      time: slot.time,
      isAvailable: slot.isAvailable,
      player: slot.player || '' // Eğer player bilgisi varsa ekle, yoksa boş bırak
    }));
    this.updateAllSlots(kortSlots);
  }

  private updateAllSlots(newSlots: { kort: number, time: string, isAvailable: boolean }[]) {
    const currentSlots = this.allSlots.value;
    const updatedSlots = [...currentSlots, ...newSlots];
    this.allSlots.next(updatedSlots);
  }
}
