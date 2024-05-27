import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RezervasyonPageRoutingModule } from './rezervasyon-routing.module';

import { RezervasyonPage } from './rezervasyon.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RezervasyonPageRoutingModule,
    
  ],
  declarations: [RezervasyonPage]
})
export class RezervasyonPageModule {}
