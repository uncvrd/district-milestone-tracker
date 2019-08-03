import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
  ) { }


  public async request<T>(method: "GET" | "POST" | "PUT" | "DELETE", url: string, queryParams?: any, body?: any) {
    console.log(this.afAuth.auth.currentUser)
    this.afAuth.user.

  }

}
