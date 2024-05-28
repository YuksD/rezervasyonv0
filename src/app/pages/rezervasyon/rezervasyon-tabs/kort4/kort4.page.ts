import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kort4',
  templateUrl: './kort4.page.html',
  styleUrls: ['./kort4.page.scss'],
})
export class Kort4Page implements OnInit {
  timeSlots: { time: string, isAvailable: boolean }[] = [];
  
  constructor() { 
    this.generateTimeSlots();
  }

  ngOnInit() {
  }
 generateTimeSlots() {
    const startHour = 9;
    const endHour = 21;
    for (let hour = startHour; hour < endHour; hour++) {
      this.timeSlots.push({ time: `${hour}:00`, isAvailable: this.checkAvailability(hour, 0) });
      this.timeSlots.push({ time: `${hour}:30`, isAvailable: this.checkAvailability(hour, 30) });
    }
  }

  checkAvailability(hour: number, minute: number): boolean {
    // Doluluk kontrolünü burada gerçekleştirin
    // Örnek olarak rastgele bir durum döndürüyoruz
    return Math.random() > 0.5;
  }
}
