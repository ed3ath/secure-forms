import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    public auth: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    console.log("init")
  }

  async login() {
    this.auth.login().then(async () => {
      console.log('navigating')
      this.router.navigate(['/form']);
      console.log('navigating done')
    });
  }

  logout() {
    this.auth.logout();
  }
}
