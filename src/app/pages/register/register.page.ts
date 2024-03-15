import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  ionicForm!: FormGroup;

  constructor(
    public auth: AuthService,
    private error: ErrorService,
    private router: Router,
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
      password: [
        '',
        [
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
          Validators.required,
        ],
      ],
    });
  }
  get errorControl() {
    return this.ionicForm.controls;
  }
  async signUpWithGoogle() {
    const loading = await this.setLoading();
    this.auth
      .loginWithGoogle()
      .then(async () => {
        this.router.navigate(['/form']);
      })
      .catch(async (e) => {
        await this.presentToast(this.error.getErrorMessage(e.code), 'danger');
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async register() {
    const loading = await this.loading.create();
    await loading.present();
    this.auth
      .register(this.ionicForm.value.email, this.ionicForm.value.password)
      .then(async () => {
        await this.presentToast(
          'An verification has been sent to your email',
          'success'
        );
        this.router.navigate(['/login']);
      })
      .catch(async (e) => {
        await this.presentToast(this.error.getErrorMessage(e.code), 'danger');
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
