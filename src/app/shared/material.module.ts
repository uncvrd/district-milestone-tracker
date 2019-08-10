import { NgModule } from '@angular/core';
import {
  MatFormFieldModule, 
  MatChipsModule,
  MatIconModule,
  MatListModule,
  MatDividerModule,
  MatInputModule
} from '@angular/material';

const modules = [
  MatFormFieldModule,
  MatChipsModule,
  MatIconModule,
  MatListModule,
  MatDividerModule,
  MatInputModule
]

@NgModule({
  imports: [...modules],
  exports: [...modules]
})
export class MaterialModule { }
