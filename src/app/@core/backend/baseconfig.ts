import { Injectable, Inject } from '@angular/core';
import { WINDOW } from '../backend/window.service';

@Injectable({
  providedIn: 'root',
})

export class BaseConfig {
  @Inject(WINDOW) public window: Window;

  domain: string = this.getDomain();
  localRestHost: string = this.domain;
  windowLocation: any = window.location;
  restHost: string = window.location.origin;
  pathname: string = window.location.pathname;
  envExtension: string = '';
  isLocal: string = '';
  env: string = '';
  envName: string = '';
  envSocketName: string = '';
  restPath: string = '';
  restSocketPath: string = '';
  globals: any = {};

  constructor() {
    this.init();
  }

  getDomain() {
    if (location.hostname.indexOf('tasainc') !== -1) {
      return 'https://api.tasainc.com'; // 35.247.90.252:8080
    } else if (location.hostname.indexOf('52.20.117.251') !== -1) {
      return 'http://54.159.150.229';
      // return '34.86.93.22:8080'; // Pre Prod Env
    } else if (location.hostname.indexOf('localhost') !== -1) {
      return 'http://54.159.150.229';
      // return '34.86.93.22:8080'; // Pre Prod Env
    }
  }

  init() {
    if (this.windowLocation.hostname.indexOf('localhost') === 0) {
       // Local Env
      this.restHost = this.localRestHost;
      this.envExtension = '-playground';
      this.env = 'DEV';
      this.isLocal = '&local=true';
      if (this.windowLocation.search.indexOf('offline') > 0) {
        this.env = 'DEV-OFFLINE';
      }
      if (this.windowLocation.search.indexOf('online') > 0) {
        this.env = 'DEV-ONLINE';
      }
    } else if (location.hostname.indexOf('52.20.117.251') === 0) {
      // Pre-Prod Env
      this.restHost = this.localRestHost;
      this.envExtension = '-playground';
      this.env = 'PRE-PROD';
    } else {
      // Prod Env
      this.restHost = this.localRestHost;
      this.envExtension = '-production';
      this.env = 'PROD';
    }
    this.restPath = this.restHost + '/tasaapi/v1';

    this.globals = {
      baseRestPath: this.restPath,
      env: this.env,
      envExtension: this.envExtension,
      isLocal: function () {
        return this.windowLocation.hostname == 'localhost' ? '&local=true' : '';
      },
      isProduction: function () {
        var envrmt =
          this.windowLocation.hostname.indexOf('localhost') === 0 || this.windowLocation.pathname.indexOf('-') !== -1
            ? false
            : true;
        return envrmt;
      },
    };
  }
}
