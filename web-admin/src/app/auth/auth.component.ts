import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from '../services/app-config.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  host: {
    class: "component-wrapper"
  }
})
export class AuthComponent {
  appName = "";
  constructor(private route: ActivatedRoute,
    private appConfig: AppConfigService) {
      this.appName = this.appConfig.config.appName;
  }
}
