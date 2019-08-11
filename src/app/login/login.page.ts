import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { take, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  goToPrivacyPolicy() {
    this.router.navigate(["/privacy-policy"]);
  }

}
