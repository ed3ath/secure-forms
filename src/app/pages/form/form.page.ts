import { Component, inject } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  collection,
  collectionData,
  updateDoc,
  addDoc,
  DocumentReference,
  doc,
  collectionChanges,
} from '@angular/fire/firestore';
import * as _ from 'lodash';
import { map } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { CryptoService } from 'src/app/services/crypto.service';

import { fields } from './fields';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage {
  private firestore: Firestore = inject(Firestore);
  formFields = fields;
  data: any;
  firebaseData: any;
  collection!: CollectionReference;
  docId!: string;
  loading = true;

  constructor(
    private auth: AuthService,
    private crypto: CryptoService,
    private store: StorageService
  ) {
    this.loading = true;
    if (!this.data) {
      const data: any = {};
      _.forEach(fields, (category) => {
        _.forEach(category.fields, (field) => {
          if (field.type === 'checkbox') {
            data[field.name] = field.default ?? false;
          } else {
            data[field.name] = '';
          }
        });
      });
      this.data = data;
      this.firebaseData = data;
    }

    this.collection = collection(this.firestore, `submitted-forms`);


    this.store.get('forms').then((data) => {
      if (data) {
        this.data = data;
      }
    });

    collectionData(this.collection, { idField: 'id' }).subscribe((data) => {
      this.processData(data);
    });

    // collectionChanges(this.collection)
    //   .pipe(
    //     map((items) =>
    //       items.map((item) => {
    //         const data = item.doc.data();
    //         return { id: item.doc.id, ...data };
    //       })
    //     )
    //   )
    //   .subscribe((data) => {
    //     this.processData(data);
    //   });
  }

  processData(data: any) {
    const userData = _.find(data, (i: any) => i.uid === this.auth.user.uid);
    if (userData) {
      this.firebaseData = this.decryptFields(userData);
      console.log(this.firebaseData)
      _.forEach(_.keys(this.data), (key) => {
        console.log(this.data[key])
        if (!this.data[key]) {
          this.data[key] = this.firebaseData[key];
        }
      })
      this.docId = data.id;
    }
    this.loading = false;
  }

  encryptFields(data: any) {
    if (data) {
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
    }

    return data;
  }

  decryptFields(data: any) {
    if (data) {
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
            data[key] = this.crypto.decrypt(data[key]);
          }
        }
      );
    }

    return data;
  }

  submit() {
    this.loading = true;
    let data = { ...this.data, uid: this.auth.user.uid };
    data = this.encryptFields(data);
    if (!this.docId) {
      addDoc(this.collection, data).then(
        (documentReference: DocumentReference) => {
          console.log(documentReference);
        }
      ).finally(() => {
        this.loading = false;
      });
    } else {
      updateDoc(doc(this.collection, this.docId), this.data).finally(() => {
        this.loading = false;
      });
    }
  }

  saveLocalData() {
    if (this.data) {
      this.store.set('forms', this.data);
    }
  }

  handleChange(key: string, e: CustomEvent) {
    if (e.detail.value) {
      console.log(e.detail.value)
      this.data[key] = e.detail.value
      this.saveLocalData();
    }
  }
}
