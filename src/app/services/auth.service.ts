import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
} from '@angular/fire/auth';

import { StorageService } from './storage.service';
import { CryptoService } from './crypto.service';
import { EventService } from './event.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  loggedIn = false;
  user: any = null;

  constructor(
    private storage: StorageService,
    private crypto: CryptoService,
    private event: EventService,
    private router: Router
  ) {}

  async register(name: string, email: string, password: string) {
    return await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    ).then(async (cred) => {
      const forms = await this.storage.get('forms');
      if (!forms[cred.user.uid]) {
        forms[cred.user.uid] = this.crypto.encrypt(JSON.stringify({
          name,
        }));
        await this.storage.set('forms', forms);
      }
      await sendEmailVerification(cred.user);
    });
  }

  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password).then(
      async (cred) => {
        const user: any = cred.user?.toJSON();
        if (!user.emailVerified) {
          throw {
            message: 'Email unverified',
            code: 'auth/email-not-verified',
          };
        }
        await this.storage.set(
          'user',
          this.crypto.encrypt(JSON.stringify(user))
        );
        this.loggedIn = true;
        this.user = user;
        this.event.publish('session', this.user);
      }
    );
  }

  async loginWithGoogle() {
    return await signInWithPopup(this.auth, new GoogleAuthProvider()).then(
      async (cred) => {
        const user = cred.user?.toJSON();
        await this.storage.set(
          'user',
          this.crypto.encrypt(JSON.stringify(user))
        );
        this.loggedIn = true;
        this.user = user;
        this.event.publish('session', this.user);
      }
    );
  }

  async logout() {
    this.auth.signOut();
    await this.storage.remove('user');
    this.router.navigate(['/login']);
  }

  async restore() {
    const user = await this.storage.get('user');
    if (user) {
      this.loggedIn = true;
      this.user = JSON.parse(this.crypto.decrypt(user));
      this.event.publish('session', this.user);
    }
  }

  async forgotPassword(email: string) {
    return await sendPasswordResetEmail(this.auth, email);
  }
}
