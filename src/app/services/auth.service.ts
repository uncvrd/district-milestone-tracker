import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<firebase.User>; 
  // user$: Observable<User>;

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
    this.initClient();
  }

  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    const { uid, displayName, photoURL, refreshToken, uploadPlaylistId } = user;

    const data = {
      uid: uid,
      refreshToken: refreshToken,
      displayName: displayName,
      photoURL: photoURL,
      uploadPlaylistId: uploadPlaylistId
    }

    return userRef.set(data, { merge: true })

  }

  // async signOut() {
  //   await this.afAuth.auth.signOut();
  //   this.router.navigate(['/login']);
  // }

  // Initialize the Google API client with desired scopes
  initClient() {
    gapi.load('client', () => {
      console.log('loaded client')

      // It's OK to expose these credentials, they are client safe.
      gapi.client.init({
        apiKey: 'AIzaSyC7tLF4bs2-Pd36kNjsBqeEiFA7Q3EaCfQ',
        clientId: '992040735911-dojc5jvsuo6cp1jagnhkp8cijq9epct3.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        scope: 'https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.readonly'
      })

      gapi.client.load('youtube', 'v3', () => console.log('loaded youtube'));

    });
  }

  async login() {
    const googleAuth = gapi.auth2.getAuthInstance()
    const googleUser = await googleAuth.signIn();
  
    const token = googleUser.getAuthResponse().id_token;
    const credential = auth.GoogleAuthProvider.credential(token);

    var userObj: User;

    const { user, additionalUserInfo } = await this.afAuth.auth.signInWithCredential(credential);

    const channel = await gapi.client.youtube.channels.list({
      part: 'contentDetails',
      mine: true
    });

    const playlistId = channel.result.items[0].contentDetails.relatedPlaylists.uploads;

    userObj = {
      ...user,
      uploadPlaylistId: playlistId,
    }

    await this.updateUserData(userObj);
    this.router.navigate(['/home'])
    
  }
  
  async logout() {
    await this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

}
