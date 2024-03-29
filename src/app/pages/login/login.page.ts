import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  ionicForm!: FormGroup;

  constructor(
    public auth: AuthService,
    private error: ErrorService,
    private router: Router,
    private toaster: ToastController,
    private loading: LoadingController,
    public formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      password: ['', [Validators.required]],
    });
  }

  async login() {
    const { email, password } = this.ionicForm.value;
    if (!email || !password) return;

    const loading = await this.setLoading();
    this.auth
      .login(email, password)
      .then(async () => {
        this.router.navigate(['/form']);
      }).catch(async (e) => {
        await this.presentToast(this.error.getErrorMessage(e.code), 'danger');
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async loginWithGoogle() {
    const loading = await this.setLoading();
    this.auth
      .loginWithGoogle()
      .then(async () => {
        this.router.navigate(['/form']);
      }).catch(async (e) => {
        await this.presentToast(this.error.getErrorMessage(e.code), 'danger');
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  get errorControl() {
    return this.ionicForm.controls;
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
