import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DbService } from '../services/db.service';
import { User } from '../models/user.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  milestoneForm: FormGroup

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  milestones: number[] = [];
  user: User;
  recentMilestones = [];

  constructor(
    private db: DbService,
    public auth: AuthService,
    private toast: ToastController,
    private formBuilder: FormBuilder
  ) {
    this.milestoneForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.auth.user$.subscribe((user: User) => {
      if (user) {
        this.db.collection$(`recent-milestones/${user.uid}/videos`, ref => ref.orderBy('date', 'desc').limit(10)).subscribe((videos) => {
          this.recentMilestones = videos;
        })
        this.db.doc$(`users/${user.uid}`).subscribe((user: User) => {
          this.parseUser(user);
        })
      }
    })
  }

  parseUser(user: User) {
    this.user = user;
    this.milestones = user.milestones || [];
    this.milestoneForm.patchValue({
      email: this.user.email
    })
  }

  add(event) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.milestones.push(parseInt(value));
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

  onMilestoneClick(milestone) {
    window.open(`https://youtu.be/${milestone.videoId}`);
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

  async logout() {
    await this.auth.logout();
    this.milestones = [];
    this.user = null;
    this.recentMilestones = [];
  }

}
