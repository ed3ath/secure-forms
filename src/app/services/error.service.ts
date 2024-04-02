import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  errors: any = {
    'auth/email-already-in-use':
      'The provided email is already in use by an existing user.',
    'auth/invalid-email':
      'The provided value for the email user property is invalid.',
    'auth/invalid-credential':
      'The credentials used to authenticate are invalid.',
    'auth/invalid-password':
      'The provided value for the password is invalid. It must be a string with at least six characters.',
    'auth/too-many-requests':
      'The number of requests exceeds the maximum allowed. Try again in a few minutes.',
    'auth/popup-closed-by-user': 'Login cancelled.',
    'auth/email-not-verified':
      'The provided email is not verified. Check your inbox/spam for email verification.',
    'auth/weak-password': 'The password must be 6 characters long or more.',
  };

  constructor() {}

  getErrorMessage(code: string) {
    console.log(code);
    if (!_.isNil(this.errors[code])) {
      return this.errors[code];
    }
    return 'An error occurred, try again later.';
  }
}
