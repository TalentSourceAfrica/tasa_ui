// core
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { distinctUntilChanged, filter, map, mergeMap, delay, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

// commonly used servcies

import { UiService } from '@app/services/ui.service';
import { UtilityService } from '@app/services/utility.service';
import { DialogService } from './dialog.service';
import { DeviceDetectorService } from 'ngx-device-detector';

// jquery & extras
import * as moment from 'moment';
import * as underscore from 'underscore';
import * as jQuery from 'jquery';
import { ConfigService } from './config.service';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  public plugins: any = {};
  public stores: any = {};

  constructor(
    public uiService: UiService,
    public utilityService: UtilityService,
    public router: Router,
    public dialogService: DialogService,
    public configService: ConfigService,
    public urlService: UrlService,
    public deviceDetectorService: DeviceDetectorService
  ) {
    this.initPlugins();
  }

  initPlugins() {
    this.plugins['jQ'] = jQuery;
    this.plugins['mom'] = moment;
    this.plugins['undSco'] = underscore;
  }

  ngOnDestroy() {}
}
