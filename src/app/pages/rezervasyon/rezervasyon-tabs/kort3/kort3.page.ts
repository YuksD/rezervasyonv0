import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RezervasyonModalComponent } from 'src/app/pages/rezervasyon/rezervasyon-modal/rezervasyon-modal.component';
import { KortService } from 'src/app/services/kort.service';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-kort3',
  templateUrl: './kort3.page.html',
  styleUrls: ['./kort3.page.scss'],
})
export class Kort3Page implements OnInit {
  timeSlots: { kort: number; time: string; isAvailable: boolean; player?: string; date: string }[] = [];
  selectedDate: string = 'today';

  constructor(
    private modalController: ModalController,
    private kortService: KortService,
    private dateService: DateService
  ) {}

  ngOnInit() {
    // Seçilen tarihi takip et
    this.dateService.selectedDate$.subscribe(date => {
      this.selectedDate = date;
      this.loadSlots();  // Seçilen tarihe ve kort numarasına göre verileri yükle
    });
  }

  loadSlots() {
    this.kortService.allSlots$.subscribe(slots => {
      // Kort numarasına göre filtreleme yap (Kort 3)
      const kort3Slots = slots.filter(slot => slot.kort === 3);
  
      // Seçilen tarihe göre filtreleme yap
      const filteredSlots = kort3Slots.filter(slot => slot.date === this.selectedDate);
  
      // Ekranda gösterilecek slotları ayarla
      this.timeSlots = filteredSlots.map(slot => ({
        ...slot,
        date: this.selectedDate // veya mevcut tarih bilgisini buraya ekleyin
      }));
    });
  }
  

  // Modal açma ve rezervasyon yapma fonksiyonu
  async onBadgeClick(slot: any) {
    if (slot.isAvailable) {
      const modal = await this.modalController.create({
        component: RezervasyonModalComponent,
        cssClass: 'custom-modal',
        componentProps: {
          startTime: slot.time,  // Başlangıç saati modala gönderiliyor
          endTime: ''            // Bitiş saati modül içinde hesaplanacak
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
    this.kortService.updateKortSlots(3, updatedSlots);  // Kort numarasını doğru girdiğinizden emin olun.
  }
}
