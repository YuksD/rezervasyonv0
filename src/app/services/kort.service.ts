import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KortDataService } from './kort-data.service';

interface Kort {
  kort: number;
  startHour: number;
  endHour: number;
}

@Injectable({
  providedIn: 'root'
})
export class KortService {
  private allSlots = new BehaviorSubject<{ kort: number, time: string, isAvailable: boolean, player?: string, date: string }[]>([]);
  allSlots$ = this.allSlots.asObservable();
  private rezervasyonlar: any[] = [];

  constructor(private kortDataService: KortDataService) {}

  // Kort ve rezervasyon bilgilerini yükleme
  loadAllKortSlots() {
    this.kortDataService.getRezervasyonlar().subscribe(rezervasyonlar => {
      this.rezervasyonlar = rezervasyonlar.rezervasyonlar;

      this.kortDataService.getKortlar().subscribe(kortlar => {
        kortlar.kortlar.forEach((kort: Kort) => {
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

  // Kort için slotları oluşturma (boş slotlar ekleniyor)
  private generateTimeSlots(kortNumber: number, startHour: number, endHour: number) {
    const slots = [];

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(this.createSlot(kortNumber, `${hour}:00`));
      slots.push(this.createSlot(kortNumber, `${hour}:30`));
    }
    return slots;
  }

  // Slot oluşturma
  private createSlot(kortNumber: number, time: string) {
    const reservation = this.rezervasyonlar.find(r => r.kort === kortNumber && r.time === time);
    
    return {
      kort: kortNumber,
      time: time,
      isAvailable: !reservation,  // Rezervasyon yoksa true
      player: reservation ? reservation.player : undefined,
      date: reservation ? reservation.date : ''  // Tarihi JSON'dan al
    };
  }

  // Korttaki slotları güncelleme
  public updateKortSlots(kortNumber: number, slots: { time: string, isAvailable: boolean, player?: string, date: string }[]) {
    const kortSlots = slots.map(slot => ({
      kort: kortNumber,
      time: slot.time,
      isAvailable: slot.isAvailable,
      player: slot.player || '',
      date: slot.date  // JSON'dan gelen tarih
    }));
    this.updateAllSlots(kortSlots);
  }

  // Tüm slotları güncelleme
  private updateAllSlots(newSlots: { kort: number, time: string, isAvailable: boolean, player?: string, date: string }[]) {
    const currentSlots = this.allSlots.value;

    // Yeni slotları mevcut slotlar ile güncelle
    const updatedSlots = currentSlots.map(slot => {
      const matchingNewSlot = newSlots.find(newSlot => newSlot.kort === slot.kort && newSlot.time === slot.time);
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
