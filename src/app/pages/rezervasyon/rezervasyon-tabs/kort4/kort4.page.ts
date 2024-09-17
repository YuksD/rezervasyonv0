import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RezervasyonModalComponent } from 'src/app/pages/rezervasyon/rezervasyon-modal/rezervasyon-modal.component';
import { KortService } from 'src/app/services/kort.service';

@Component({
  selector: 'app-kort4',
  templateUrl: './kort4.page.html',
  styleUrls: ['./kort4.page.scss'],
})
export class Kort4Page implements OnInit {
  timeSlots: { time: string, isAvailable: boolean, player?: string }[] = [];

  constructor(
    private modalController: ModalController,
    private kortService: KortService
  ) { }

  ngOnInit() {
    // Bu bileşen artık kendi slotlarını yüklemiyor
    this.kortService.allSlots$.subscribe(slots => {
      this.timeSlots = slots.filter(slot => slot.kort === 4);
    });
  }
  async onBadgeClick(slot: any) {
    if (slot.isAvailable) {
      const modal = await this.modalController.create({
        component: RezervasyonModalComponent,
        cssClass: 'custom-modal'
      });
      await modal.present();
    } else {
      console.log('Slot dolu, rezervasyon yapılamaz.');
    }
  }
}