import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, untilDestroyed } from '@core';
import { I18nService } from '@app/i18n';

const log = new Logger('App');
declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public openChat: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translateService: TranslateService,
    private i18nService: I18nService
  ) {}

  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    log.debug('init');

    // Setup translations
    this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    const onNavigationEnd = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));
    // Change page title on navigation or language change, based on route data
    merge(this.translateService.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        switchMap((route) => route.data),
        untilDestroyed(this)
      )
      .subscribe((event) => {
        const title = event.title;
        if (title) {
          this.titleService.setTitle(this.translateService.instant(title));
        }
        if(location.hash !== '#/home'){
          jQuery('.header-top-area').removeClass('position-absolute');
        }
      });
  }

  ngAfterViewInit(): void {
    let $t = this;
    jQuery('#prime').click(function () {
      toggleFab();
    });

    //Toggle chat and links
    function toggleFab() {
      $t.openChat = !$t.openChat;
      setTimeout(() => {
        hideChat(0);
        jQuery('.prime').toggleClass('zmdi-comment-outline');
        jQuery('.prime').toggleClass('fa-times-circle');
        jQuery('.prime').toggleClass('is-active');
        jQuery('.prime').toggleClass('is-visible');
        jQuery('#prime').toggleClass('is-float');
        jQuery('.chat').toggleClass('is-visible');
        jQuery('.fab').toggleClass('is-visible');
      }, 200);
    }

    jQuery('#chat_first_screen').click((e: any) => {
      hideChat(1);
    });

    jQuery('#chat_second_screen').click((e: any) => {
      hideChat(2);
    });

    jQuery('#chat_third_screen').click((e: any) => {
      hideChat(3);
    });

    jQuery('#chat_fourth_screen').click((e: any) => {
      hideChat(4);
    });

    jQuery('#chat_fullscreen_loader').click((e: any) => {
      jQuery('.fullscreen').toggleClass('zmdi-window-maximize');
      jQuery('.fullscreen').toggleClass('zmdi-window-restore');
      jQuery('.chat').toggleClass('chat_fullscreen');
      jQuery('.fab').toggleClass('is-hide');
      jQuery('.header_img').toggleClass('change_img');
      jQuery('.img_container').toggleClass('change_img');
      jQuery('.chat_header').toggleClass('chat_header2');
      jQuery('.fab_field').toggleClass('fab_field2');
      jQuery('.chat_converse').toggleClass('chat_converse2');
      //jQuery('#chat_converse').css('display', 'none');
      // jQuery('#chat_body').css('display', 'none');
      // jQuery('#chat_form').css('display', 'none');
      // jQuery('.chat_login').css('display', 'none');
      // jQuery('#chat_fullscreen').css('display', 'block');
    });

    function hideChat(hide: any) {
      switch (hide) {
        case 0:
          jQuery('#chat_converse').css('display', 'none');
          jQuery('#chat_body').css('display', 'none');
          jQuery('#chat_form').css('display', 'none');
          jQuery('.chat_login').css('display', 'block');
          jQuery('.chat_fullscreen_loader').css('display', 'none');
          jQuery('#chat_fullscreen').css('display', 'none');
          break;
        case 1:
          jQuery('#chat_converse').css('display', 'block');
          jQuery('#chat_body').css('display', 'none');
          jQuery('#chat_form').css('display', 'none');
          jQuery('.chat_login').css('display', 'none');
          jQuery('.chat_fullscreen_loader').css('display', 'block');
          break;
        case 2:
          jQuery('#chat_converse').css('display', 'none');
          jQuery('#chat_body').css('display', 'block');
          jQuery('#chat_form').css('display', 'none');
          jQuery('.chat_login').css('display', 'none');
          jQuery('.chat_fullscreen_loader').css('display', 'block');
          break;
        case 3:
          jQuery('#chat_converse').css('display', 'none');
          jQuery('#chat_body').css('display', 'none');
          jQuery('#chat_form').css('display', 'block');
          jQuery('.chat_login').css('display', 'none');
          jQuery('.chat_fullscreen_loader').css('display', 'block');
          break;
        case 4:
          jQuery('#chat_converse').css('display', 'none');
          jQuery('#chat_body').css('display', 'none');
          jQuery('#chat_form').css('display', 'none');
          jQuery('.chat_login').css('display', 'none');
          jQuery('.chat_fullscreen_loader').css('display', 'block');
          jQuery('#chat_fullscreen').css('display', 'block');
          break;
      }
    }
  }

  ngOnDestroy() {
    this.i18nService.destroy();
  }
}
