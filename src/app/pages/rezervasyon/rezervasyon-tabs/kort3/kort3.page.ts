import { Component, OnInit } from '@angular/core';
import { KortService } from 'src/app/services/kort.service';

@Component({
  selector: 'app-kort3',
  templateUrl: './kort3.page.html',
  styleUrls: ['./kort3.page.scss'],
})
export class Kort3Page implements OnInit {
  timeSlots: { time: string, isAvailable: boolean }[] = [];

  constructor(private kortService: KortService) { }

  ngOnInit() {
    // Bu bileşen artık kendi slotlarını yüklemiyor
    this.kortService.allSlots$.subscribe(slots => {
      this.timeSlots = slots.filter(slot => slot.kort === 3);
    });
  }
}