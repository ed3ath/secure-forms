import { Component, inject } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  collection,
  collectionData,
  updateDoc,
  addDoc,
  getDoc,
  DocumentReference,
  doc,
  collectionChanges,
} from '@angular/fire/firestore';
import * as _ from 'lodash';
import { Observable, map } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { CryptoService } from 'src/app/services/crypto.service';

import { fields } from './fields';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage {
  private firestore: Firestore = inject(Firestore);
  formFields = fields;
  data: any;
  collection!: CollectionReference;
  docId!: string;

  constructor(private auth: AuthService, private crypto: CryptoService) {
    if (!this.data) {
      const data: any = {};
      _.forEach(fields, (category) => {
        _.forEach(category.fields, (field) => {
          data[field.name] = '';
        });
      });
      this.data = data;
    }

    this.collection = collection(this.firestore, `submitted-forms`);

    collectionData(this.collection, { idField: 'id' }).subscribe(data => {
      this.processData(data);
    });

    collectionChanges(this.collection)
      .pipe(
        map((items) =>
          items.map((item) => {
            const data = item.doc.data();
            return { id: item.doc.id, ...data };
          })
        )
      )
      .subscribe(data => {
        this.processData(data);
      });
  }

  processData(data: any) {
    const userData = _.find(data, (i: any) => i.uid === this.auth.user.uid);
    if (userData) {
      _.forEach(
        [
          'remoteAddress',
          'remoteUsername',
          'remotePassword',
          'iQUsername',
          'iQPassword',
        ],
        (key) => {
          if (userData[key]) {
            userData[key] = this.crypto.decrypt(userData[key]);
          }
        }
      );
      this.data = userData;
      this.docId = data.id;
    }
  }

  submit() {
    const data = { ...this.data, uid: this.auth.user.uid };
    _.forEach(
      [
        'remoteAddress',
        'remoteUsername',
        'remotePassword',
        'iQUsername',
        'iQPassword',
      ],
      (key) => {
        if (data[key]) {
          data[key] = this.crypto.encrypt(data[key]);
        }
      }
    );
    if (!this.docId) {
      addDoc(this.collection, data).then(
        (documentReference: DocumentReference) => {
          console.log(documentReference);
        }
      );
    } else {
      updateDoc(doc(this.collection, this.docId), this.data);
    }
  }
}
