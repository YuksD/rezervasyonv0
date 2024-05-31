import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KortService {
  private allSlots = new BehaviorSubject<{ kort: number, time: string, isAvailable: boolean }[]>([]);
  allSlots$ = this.allSlots.asObservable();

  constructor() { }

  updateAllSlots(newSlots: { kort: number, time: string, isAvailable: boolean }[]) {
    const currentSlots = this.allSlots.value;
    const updatedSlots = [...currentSlots, ...newSlots];
    this.allSlots.next(updatedSlots);
  }

  updateKortSlots(kortNumber: number, slots: { time: string, isAvailable: boolean }[]) {
    const kortSlots = slots.map(slot => ({
      kort: kortNumber,
      time: slot.time,
      isAvailable: slot.isAvailable,
    }));
    this.updateAllSlots(kortSlots);
  }

  loadAllKortSlots() {
    this.loadKortSlots(1);
    this.loadKortSlots(2);
    this.loadKortSlots(3);
    this.loadKortSlots(4);
  }

  private loadKortSlots(kortNumber: number) {
    const slots = this.generateTimeSlots();
    this.updateKortSlots(kortNumber, slots);
  }

  private generateTimeSlots() {
    const startHour = 9;
    const endHour = 21;
    const slots = [];

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({ time: `${hour}:00`, isAvailable: this.checkAvailability(hour, 0) });
      slots.push({ time: `${hour}:30`, isAvailable: this.checkAvailability(hour, 30) });
    }

    return slots;
  }

  private checkAvailability(hour: number, minute: number): boolean {
    return Math.random() > 0.5; 
  }
}
