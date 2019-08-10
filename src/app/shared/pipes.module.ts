import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberFormatPipe } from '../pipes/number-format.pipe';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [NumberFormatPipe],
  exports: [NumberFormatPipe],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class PipesModule { }
