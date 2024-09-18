import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RezervasyonModalComponent } from 'src/app/pages/rezervasyon/rezervasyon-modal/rezervasyon-modal.component';
import { KortService } from 'src/app/services/kort.service';

@Component({
  selector: 'app-kort1',
  templateUrl: './kort1.page.html',
  styleUrls: ['./kort1.page.scss'],
})
export class Kort1Page implements OnInit {
  // Tüm zaman slotlarını ve oyuncu bilgilerini içeren liste
  timeSlots: { time: string, isAvailable: boolean, player?: string }[] = [];
  selectedDate: string = new Date().toISOString(); // Seçili tarih

  constructor(
    private modalController: ModalController,
    private kortService: KortService
  ) { }

  ngOnInit() {
    // Kort1'e ait slotları filtrele ve göster
    this.kortService.allSlots$.subscribe(slots => {
      this.timeSlots = slots.filter(slot => slot.kort === 1);
    });
  }

  // Rezervasyon yapma modalını açma ve işlem yapma
  async onBadgeClick(slot: any) {
    if (slot.isAvailable) {
      const modal = await this.modalController.create({
        component: RezervasyonModalComponent,
        cssClass: 'custom-modal',
        componentProps: {
          startTime: slot.time,  // Başlangıç saati modala gönderiliyor
          endTime: '',            // Bitiş saati modül içinde hesaplanacak
          selectedDate: this.selectedDate  // Tarih bilgisini modal'a ilet
        }
      });
  
      modal.onDidDismiss().then((result) => {
        const data = result.data;
        if (data) {
          this.reserveSlot(slot.time, data);  // Slotu rezerve et
        }
      });
  
      await modal.present();
    } else {
      console.log('Slot dolu, rezervasyon yapılamaz.');
    }
  }
  
  // Slotu rezerve etme işlemi
  reserveSlot(time: string, data: { player: string; startTime: string; endTime: string; duration: number }) {
    const updatedSlots = this.timeSlots.map(slot => {
      if (slot.time === time) {
        return {
          ...slot,
          isAvailable: false,  // Slot artık dolu
          player: data.player   // Oyuncu ismi ekleniyor
        };
      }
      return slot;
    });

    // Güncellenmiş slotları ayarla
    this.timeSlots = updatedSlots;

    // Kort bilgilerini KortService'e göndererek güncelle
    this.kortService.updateKortSlots(1, updatedSlots);  // Kort numarasını doğru girdiğinizden emin olun.
  }
}
