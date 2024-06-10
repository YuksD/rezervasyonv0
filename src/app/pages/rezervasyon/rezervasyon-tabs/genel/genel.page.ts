import { Component, OnInit } from '@angular/core';
import { KortService } from 'src/app/services/kort.service';

@Component({
  selector: 'app-genel',
  templateUrl: './genel.page.html',
  styleUrls: ['./genel.page.scss'],
})
export class GenelPage implements OnInit {
  timeSlots: { time: string, kort1: boolean, kort2: boolean, kort3: boolean, kort4: boolean }[] = [];

  constructor(private kortService: KortService) { }

  ngOnInit() {
    // Uygulama başlatıldığında tüm kortlara ait slotları yükle
    this.kortService.loadAllKortSlots();

    // Tüm kortlara ait verileri almak için KortService'den abone ol
    this.kortService.allSlots$.subscribe(slots => {
      // Kort verilerini birleştirerek genel zaman slotları oluştur
      this.timeSlots = this.mergeTimeSlots(slots);
    });
  }

  mergeTimeSlots(slots: { kort: number, time: string, isAvailable: boolean }[]) {
    const kort1Slots = slots.filter(slot => slot.kort === 1);
    const kort2Slots = slots.filter(slot => slot.kort === 2);
    const kort3Slots = slots.filter(slot => slot.kort === 3);
    const kort4Slots = slots.filter(slot => slot.kort === 4);

    const maxLength = Math.max(kort1Slots.length, kort2Slots.length, kort3Slots.length, kort4Slots.length);

    const mergedSlots = [];

    for (let i = 0; i < maxLength; i++) {
      mergedSlots.push({
        time: kort1Slots[i]?.time || kort2Slots[i]?.time || kort3Slots[i]?.time || kort4Slots[i]?.time,
        kort1: kort1Slots[i]?.isAvailable || false,
        kort2: kort2Slots[i]?.isAvailable || false,
        kort3: kort3Slots[i]?.isAvailable || false,
        kort4: kort4Slots[i]?.isAvailable || false
      });
    }

    return mergedSlots;
  }
}
