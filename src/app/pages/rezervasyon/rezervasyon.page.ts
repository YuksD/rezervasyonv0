import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { RezervasyonModalComponent } from './rezervasyon-modal/rezervasyon-modal.component';
import { DateService } from 'src/app/services/date.service';
import { KortService } from 'src/app/services/kort.service'; // KortService'i içe aktar

@Component({
  selector: 'app-rezervasyon',
  templateUrl: './rezervasyon.page.html',
  styleUrls: ['./rezervasyon.page.scss'],
})
export class RezervasyonPage implements OnInit {
  selectedDate: string; // ISO formatında tarih
  selectedDay: string = 'today'; // Seçilen gün başlangıçta 'today' olarak ayarlanır.

  constructor(
    private modalController: ModalController,
    private dateService: DateService,
    private kortService: KortService, // KortService'i tanımlayın
    public router: Router
  ) {
    // Başlangıçta bugünün tarihini al ve ISO formatında ayarla
    this.selectedDate = new Date().toISOString(); 
  }

  async ngOnInit() {
    // Başlangıçta bugünkü tarihi DateService'e ata
    this.dateService.setSelectedDate(this.selectedDate); 
    this.kortService.loadSlotsForDate(this.selectedDate); // Kort slotlarını yükle
  }

  async openReservationModal(startTime: string, endTime: string) {
    const modal = await this.modalController.create({
      component: RezervasyonModalComponent,
      cssClass: 'custom-modal',
      componentProps: {
        startTime: startTime,
        endTime: endTime,
        selectedDate: this.selectedDate // Tarih bilgisini modal'a ilet
      }
    });
    return await modal.present();
  }

  setDate(value: string) {
    const today = new Date();

    if (value === 'today') {
      this.selectedDate = today.toISOString(); // Bugünün tarihi
      this.selectedDay = 'today'; // Seçilen gün 'today' olarak güncellenir.
    } else if (value === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      this.selectedDate = tomorrow.toISOString();
      this.selectedDay = 'tomorrow'; // Seçilen gün 'tomorrow' olarak güncellenir.
    }

    this.updateDateService(); // DateService'i güncelle
    this.kortService.loadSlotsForDate(this.selectedDate); // Seçilen tarihe göre slotları yükle
  }

  private updateDateService() {
    this.dateService.setSelectedDate(this.selectedDate); // DateService'e tarihi günceller
  }
}
