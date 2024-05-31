import { Component, OnInit } from '@angular/core';
import { KortService } from 'src/app/kort.service';

@Component({
  selector: 'app-kort2',
  templateUrl: './kort2.page.html',
  styleUrls: ['./kort2.page.scss'],
})
export class Kort2Page implements OnInit {
  timeSlots: { time: string, isAvailable: boolean }[] = [];

  constructor(private kortService: KortService) { }

  ngOnInit() {
    // Bu bileşen artık kendi slotlarını yüklemiyor
    this.kortService.allSlots$.subscribe(slots => {
      this.timeSlots = slots.filter(slot => slot.kort === 2);
    });
  }
}
