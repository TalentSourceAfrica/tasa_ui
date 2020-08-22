import { Injectable, Inject } from '@angular/core';
import { WINDOW } from '../backend/window.service';

@Injectable({
  providedIn: 'root',
})
export class BaseConfig {
  @Inject(WINDOW) public window: Window;

  domain: string = '35.247.161.145';
  localRestHost: string = 'http://' + this.domain;
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

  init() {
    if (this.windowLocation.hostname.indexOf('localhost') === 0) {
      this.restHost = this.localRestHost;
      //   this.localSocketRestHost = this.localSocketRestHost;
      this.envExtension = '-playground';
      this.env = 'DEV';
      this.isLocal = '&local=true';

      if (this.windowLocation.search.indexOf('offline') > 0) {
        this.env = 'DEV-OFFLINE';
      }
      if (this.windowLocation.search.indexOf('online') > 0) {
        this.env = 'DEV-ONLINE';
      }
    } else if (this.pathname.indexOf('-playground') !== -1) {
      this.envExtension = '-playground';
      this.env = 'PLAYGROUND';
    }
    this.restPath = this.restHost + '/elearning';
    // this.restSocketPath = this.localSocketRestHost + '/amazeRest' + this.envExtension;

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
