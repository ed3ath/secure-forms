import { Component, OnInit } from '@angular/core';

import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private storage: StorageService,
    private auth: AuthService
  ) {}

  async ngOnInit() {
    await this.storage.init();
    await this.auth.restore();
  }
}
