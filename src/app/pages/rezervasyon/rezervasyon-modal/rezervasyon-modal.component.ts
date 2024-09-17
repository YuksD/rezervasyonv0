import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-rezervasyon-modal',
  templateUrl: './rezervasyon-modal.component.html',
  styleUrls: ['./rezervasyon-modal.component.scss'],
})
export class RezervasyonModalComponent implements OnInit {
  startTime: string = '20:00';  
  endTime: string = '';        
  selectedDuration: number = 60; 
  playerName: string = '';  // Kullanıcı adı için bir değişken ekleyin

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.updateEndTime();  
  }

  updateEndTime() {
    const [startHour, startMinute] = this.startTime.split(':').map(Number);
    const totalStartMinutes = startHour * 60 + startMinute;
    const totalEndMinutes = totalStartMinutes + parseInt(this.selectedDuration.toString(), 10);
    const endHour = Math.floor(totalEndMinutes / 60);
    const endMinute = totalEndMinutes % 60;
    const formattedEndHour = endHour.toString().padStart(2, '0');
    const formattedEndMinute = endMinute.toString().padStart(2, '0');
    this.endTime = `${formattedEndHour}:${formattedEndMinute}`;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async reserve() {
    await this.modalController.dismiss({
      player: this.playerName,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.selectedDuration
    });
  }
}
