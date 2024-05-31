import { Component, OnInit } from '@angular/core';
import { KortService } from 'src/app/kort.service';

@Component({
  selector: 'app-kort1',
  templateUrl: './kort1.page.html',
  styleUrls: ['./kort1.page.scss'],
})
export class Kort1Page implements OnInit {
  timeSlots: { time: string, isAvailable: boolean }[] = [];

  constructor(private kortService: KortService) { }

  ngOnInit() {
    // Bu bileşen artık kendi slotlarını yüklemiyor
    this.kortService.allSlots$.subscribe(slots => {
      this.timeSlots = slots.filter(slot => slot.kort === 1);
    });
  }
}
