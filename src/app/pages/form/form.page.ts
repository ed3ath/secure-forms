import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  CollectionReference,
  Firestore,
  collection,
  collectionData,
  updateDoc,
  addDoc,
  doc,
} from '@angular/fire/firestore';
import * as _ from 'lodash';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { StorageService } from 'src/app/services/storage.service';
import { EventService } from 'src/app/services/event.service';

import { fields } from './fields';

@Component({
  selector: 'app-form',
  templateUrl: './form.page.html',
  styleUrls: ['./form.page.scss'],
})
export class FormPage implements OnInit, OnDestroy {
  private firestore: Firestore = inject(Firestore);
  formFields = fields;
  data: any;
  firebaseData: any;
  collection!: CollectionReference;
  docId!: string;
  submitting = false;
  uid!: string;
  loadingState!: any;

  constructor(
    private auth: AuthService,
    private crypto: CryptoService,
    private store: StorageService,
    private toaster: ToastController,
    private loading: LoadingController,
    private event: EventService
  ) {
    if (!this.data) {
      const data: any = {};
      _.forEach(fields, (category) => {
        _.forEach(category.fields, (field: any) => {
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
    this.setLoading().then((loading) => {
      this.loadingState = loading;
    });
  }

  async ngOnInit() {
    this.uid = this.auth.user.uid;
    this.collection = collection(this.firestore, `submitted-forms`);
    await this.store.get('forms').then((data) => {
      if (data && data[this.uid]) {
        this.data = JSON.parse(this.crypto.decrypt(data[this.uid]));
      }
    });

    collectionData(this.collection, { idField: 'id' }).subscribe((data) => {
      this.processData(data);
    });
  }

  ngOnDestroy() {
    this.event.destroy('session');
  }

  processData(data: any) {
    const userData = _.find(data, (i: any) => i.uid === this.uid);
    if (userData) {
      this.firebaseData = this.decryptFields(userData);
      _.forEach(_.keys(this.data), (key) => {
        if (!this.data[key]) {
          this.data[key] = this.firebaseData[key];
        }
      });
      this.docId = userData.id;
    }
    if (this.loadingState) {
      this.loadingState.dismiss();
      this.loadingState = null;
    }
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
          'vpnAddress',
          'vpnUsername',
          'vpnPassword',
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
          'vpnAddress',
          'vpnUsername',
          'vpnPassword',
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

  async submit() {
    const loading = await this.setLoading();
    let data = { ...this.data, uid: this.uid };
    data = this.encryptFields(data);
    if (!this.docId) {
      addDoc(this.collection, data).then(async () => {
        await this.presentToast('Changes saved', 'success');
        loading.dismiss();
      });
    } else {
      updateDoc(doc(this.collection, this.docId), this.data).then(async () => {
        await this.presentToast('Changes saved', 'success');
        loading.dismiss();
      });
    }
  }

  saveLocalData() {
    if (this.data) {
      this.store.get('forms').then((forms) => {
        forms[this.uid] = this.crypto.encrypt(JSON.stringify(this.data));
        this.store.set('forms', forms);
      });
    }
  }

  handleChange(key: string, e: CustomEvent) {
    if (e.detail.value) {
      this.data[key] = e.detail.value;
      this.saveLocalData();
    }
  }

  logout() {
    this.auth.logout();
  }

  async setLoading() {
    const loading = await this.loading.create();
    await loading.present();
    return loading;
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toaster.create({
      message: message,
      duration: 3500,
      position: 'top',
      color,
    });

    await toast.present();
  }
}
