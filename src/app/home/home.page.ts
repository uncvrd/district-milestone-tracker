import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db.service';
import { User } from '../models/user.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  milestoneForm: FormGroup

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  milestones = [];
  user: User;

  recentMilestones = []

  constructor(
    private db: DbService,
    private auth: AuthService,
    private toast: ToastController,
    private formBuilder: FormBuilder
  ) {
    this.milestoneForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.auth.user$.subscribe((user: User) => {
      this.db.collection$(`recent-milestones/${user.uid}/videos`).subscribe((videos) => {
        this.recentMilestones = videos;
      })
      this.db.doc$(`users/${user.uid}`).subscribe((user: User) => {
        this.parseUser(user);
      })
    })
  }

  parseUser(user: User) {
    this.user = user;
    this.milestones = user.milestones;
    this.milestoneForm.patchValue({
      email: this.user.email
    })
  }

  add(event) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.milestones.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  async remove(milestone) {
    const index = this.milestones.indexOf(milestone);

    if (index >= 0) {
      this.milestones.splice(index, 1);
    }
  }

  onSubmit() {
    this.db.updateAt(`users/${this.user.uid}`, {
      milestones: this.milestones,
      email: this.milestoneForm.value.email
    }).then(async (res) => {
      await this.presentToast("Profile updated!")
    })
  }

  async presentToast(message: string) {
    const toast = await this.toast.create({
      duration: 2000,
      message: message,
      color: 'dark',
      position: 'bottom'
    });
    toast.present();
  }

}
