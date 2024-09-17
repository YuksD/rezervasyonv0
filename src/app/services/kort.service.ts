import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KortDataService } from './kort-data.service';

@Injectable({
  providedIn: 'root'
})
export class KortService {
  private allSlots = new BehaviorSubject<{ kort: number, time: string, isAvailable: boolean, player?: string }[]>([]);
  allSlots$ = this.allSlots.asObservable();
  private rezervasyonlar: any[] = [];

  constructor(private kortDataService: KortDataService) { }

  // Kort ve rezervasyon bilgilerini yükleme
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

  // Kort için slot bilgilerini yükleme
  private loadKortSlots(kortNumber: number, startHour: number, endHour: number) {
    const slots = this.generateTimeSlots(kortNumber, startHour, endHour);
    this.updateKortSlots(kortNumber, slots);
  }

  // Kort için slotları oluşturma
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

  // Oyuncu bilgisi alma
  private getPlayer(kortNumber: number, time: string): string | undefined {
    const reservation = this.rezervasyonlar.find(r => r.kort === kortNumber && r.time === time);
    return reservation ? reservation.player : undefined;  // Bulunursa oyuncu adını döner, yoksa null
  }

  // Kort ve zaman için uygunluk kontrolü
  private checkAvailability(kortNumber: number, time: string): boolean {
    // Kort ve saat için rezervasyon yapılıp yapılmadığını kontrol et
    const reservation = this.rezervasyonlar.find(r => r.kort === kortNumber && r.time === time);
    return !reservation;  // Rezervasyon yoksa true (uygun), varsa false (dolu)
  }

  // Korttaki slotları güncelleme
  public updateKortSlots(kortNumber: number, slots: { time: string, isAvailable: boolean, player?: string }[]) {
    const kortSlots = slots.map(slot => ({
      kort: kortNumber,
      time: slot.time,
      isAvailable: slot.isAvailable,
      player: slot.player || '' // Eğer player bilgisi varsa ekle, yoksa boş bırak
    }));
    this.updateAllSlots(kortSlots);
  }

  // Tüm slotları güncelleme
  private updateAllSlots(newSlots: { kort: number, time: string, isAvailable: boolean, player?: string }[]) {
    const currentSlots = this.allSlots.value;
  
    // Yeni slotları mevcut slotlar ile güncelle
    const updatedSlots = currentSlots.map(slot => {
      const matchingNewSlot = newSlots.find(newSlot => newSlot.kort === slot.kort && newSlot.time === slot.time);
      
      // Eğer yeni bir slot mevcut slot ile eşleşiyorsa onu güncelle
      return matchingNewSlot ? { ...slot, ...matchingNewSlot } : slot;
    });
  
    // Yeni slotlardan, mevcut slotlarda olmayanları ekle
    const additionalSlots = newSlots.filter(newSlot => 
      !currentSlots.some(slot => slot.kort === newSlot.kort && slot.time === newSlot.time)
    );
  
    // Mevcut slotları güncelle ve yeni slotları ekle
    this.allSlots.next([...updatedSlots, ...additionalSlots]);
  }
  
}
