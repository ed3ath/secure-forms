import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

import { StorageService } from 'src/app/services/storage.service';
import { CryptoService } from './crypto.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  loggedIn = false;
  user: any = null;

  constructor(
    private storage: StorageService,
    private crypto: CryptoService
  ) {}

  async login() {
    try {
      const cred = await signInWithPopup(
        this.auth,
        new GoogleAuthProvider()
      );
      if (cred) {
        const user = cred.user?.toJSON()
        await this.storage.set('user', this.crypto.encrypt(JSON.stringify(user)));
        this.loggedIn = true;
        this.user = user;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async logout() {
    this.auth.signOut();
  }

  async restore() {
    const user = await this.storage.get('user');
    if (user) {
      this.loggedIn = true;
      this.user = JSON.parse(this.crypto.decrypt(user));
    }
  }
}
