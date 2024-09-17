import { Component, OnInit } from '@angular/core';
import { KortService } from 'src/app/services/kort.service';
import { RezervasyonModalComponent } from 'src/app/pages/rezervasyon/rezervasyon-modal/rezervasyon-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-kort2',
  templateUrl: './kort2.page.html',
  styleUrls: ['./kort2.page.scss'],
})
export class Kort2Page implements OnInit {
  timeSlots: { time: string, isAvailable: boolean, player?: string }[] = [];

  constructor(
    private modalController: ModalController,
    private kortService: KortService
  ) { }
  ngOnInit() {
    // Bu bileşen artık kendi slotlarını yüklemiyor
    this.kortService.allSlots$.subscribe(slots => {
      this.timeSlots = slots.filter(slot => slot.kort === 2);
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
