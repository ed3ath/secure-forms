import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  ionicForm!: FormGroup;

  constructor(
    public auth: AuthService,
    private toaster: ToastController,
    private loading: LoadingController,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
    });
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  async send() {
    const { email } = this.ionicForm.value;
    if (!email) return;
    const loading = await this.setLoading();
    this.auth
      .forgotPassword(email)
      .then(async () => {
        await this.presentToast(
          'A reset parssword link has been sent to your email.',
          'success'
        );
      })
      .finally(() => {
        loading.dismiss();
      });
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

  async setLoading() {
    const loading = await this.loading.create();
    await loading.present();
    return loading;
  }
}
