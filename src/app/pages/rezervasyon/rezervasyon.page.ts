import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Router'ı içe aktar
import { ModalController } from '@ionic/angular';
import { RezervasyonModalComponent } from './rezervasyon-modal/rezervasyon-modal.component';
import { DateService } from 'src/app/services/date.service'; // DateService'i içe aktar

@Component({
  selector: 'app-rezervasyon',
  templateUrl: './rezervasyon.page.html',
  styleUrls: ['./rezervasyon.page.scss'],
})
export class RezervasyonPage implements OnInit {
  selectedDate: string = new Date().toISOString();
  selectedDay: string = 'today'; // Seçilen gün başlangıçta 'today' olarak ayarlanır.

  constructor(
    private modalController: ModalController,
    private dateService: DateService, // DateService'i constructor'a ekle
    public router: Router
  ) {}

  async ngOnInit() {
    // Başlangıçta bugünkü tarihi seçili tarih olarak ata
    this.selectedDate = new Date().toISOString();
  }

  async openReservationModal(startTime: string, endTime: string) {
    const modal = await this.modalController.create({
      component: RezervasyonModalComponent,
      cssClass: 'custom-modal',
      componentProps: {
        startTime: startTime,
        endTime: endTime,
        selectedDate: this.selectedDate  // Tarih bilgisini modal'a ilet
      }
    });
    return await modal.present();
  }

  // Önceki günü seçen fonksiyon
  oncekiGun() {
    let selectedDateObj = new Date(this.selectedDate);
    selectedDateObj.setDate(selectedDateObj.getDate() - 1);
    this.selectedDate = selectedDateObj.toISOString();
    this.dateService.setSelectedDate(selectedDateObj.toISOString().split('T')[0]); // Tarihi DateService'e güncelle
  }
  
  sonrakiGun() {
    let selectedDateObj = new Date(this.selectedDate);
    selectedDateObj.setDate(selectedDateObj.getDate() + 1);
    this.selectedDate = selectedDateObj.toISOString();
    this.dateService.setSelectedDate(selectedDateObj.toISOString().split('T')[0]); // Tarihi DateService'e güncelle
  }
  
  setDate(value: string) {
    const today = new Date();
    let selectedDateObj: Date;

    if (value === 'today') {
      selectedDateObj = today; // Bugünün tarihi
      this.selectedDay = 'today'; // Seçilen gün 'today' olarak güncellenir.
    } else if (value === 'tomorrow') {
      selectedDateObj = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      this.selectedDay = 'tomorrow'; // Seçilen gün 'tomorrow' olarak güncellenir.
    } else {
      selectedDateObj = new Date(); // Varsayılan bir tarih ataması yap
    }

    this.selectedDate = selectedDateObj.toISOString();
    this.dateService.setSelectedDate(selectedDateObj.toISOString().split('T')[0]);
  }
  
}
