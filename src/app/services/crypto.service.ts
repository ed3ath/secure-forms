import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  constructor() {}

  encrypt(text: string) {
    return CryptoJS.AES.encrypt(text, environment.publicKey).toString();
  }

  decrypt(text: string) {
    return CryptoJS.AES.decrypt(text, environment.publicKey).toString(CryptoJS.enc.Utf8)
  }
}
