import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // logged in
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // logged out
          return of(null)
        }
      })
    )
  }

  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/youtube')
    provider.addScope('https://www.googleapis.com/auth/youtube.readonly')
    const credential = await this.afAuth.auth.signInWithPopup(provider);
    console.log(credential);
    await this.updateUserData(credential.user);
    this.router.navigate(['/home'])
  }

  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const { uid, email, displayName, photoURL, refreshToken } = user;

    const data = {
      uid: uid,
      email: email,
      refreshToken: refreshToken,
      displayName: displayName,
      photoURL: photoURL
    }

    return userRef.set(data, { merge: true })

  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

}
