import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RezervasyonModalComponent } from './rezervasyon-modal/rezervasyon-modal.component';

@Component({
  selector: 'app-rezervasyon',
  templateUrl: './rezervasyon.page.html',
  styleUrls: ['./rezervasyon.page.scss'],
})
export class RezervasyonPage implements OnInit {
  selectedDate: string = new Date().toISOString();

  constructor(private modalController: ModalController) {}

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
  }

  // Sonraki günü seçen fonksiyon
  sonrakiGun() {
    let selectedDateObj = new Date(this.selectedDate);
    selectedDateObj.setDate(selectedDateObj.getDate() + 1);
    this.selectedDate = selectedDateObj.toISOString();
  }
}
