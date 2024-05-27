import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Kort1PageRoutingModule } from './kort1-routing.module';

import { Kort1Page } from './kort1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Kort1PageRoutingModule
  ],
  declarations: [Kort1Page]
})
export class Kort1PageModule {}
