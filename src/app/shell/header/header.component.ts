import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// services
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { delay } from 'underscore';
import { untilDestroyed } from '@app/@core';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('file', { static: false }) public file: any;
  isAdmin: boolean = false;
  searchCourseText: string = '';
  notificationsData: any = [];
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private sharedService: SharedService
  ) {
    this.user.type.toLowerCase() == 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
  }

  onCourseSearch() {
    this.sharedService.utilityService.onCourseSearch(this.searchCourseText, 'text');
  }

  logout() {
    this.sharedService.uiService.showApiSuccessPopMsg('Logout Successfully...!');
    setTimeout(() => {
      this.sharedService.uiService.closePopMsg();
      this.authenticationService.logout().subscribe(() => this.router.navigate(['/home'], { replaceUrl: true }));
    }, 1000);
  }

  login() {
    this.authenticationService.openLoginPopup();
  }

  userDetails() {
    this.authenticationService.openUserDetailsPopup();
  }

  scrollToFaq(_id: string) {
    this.sharedService.utilityService.scrollToElement(_id);
  }

  callUpload() {
    this.file.nativeElement.click();
  }

  handleFileInput(event: any) {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadUserImage', { '{email}': $t.user.email });
    let files = event.target.files;
    var form = new FormData();
    form.append('file', files[0], files[0].name);
    if ($t.sharedService.utilityService.ValidateImageUpload(files[0].name)) {
      $t.sharedService.uiService.showApiStartPopMsg('Updating User Avatar...');

      $t.sharedService.configService.post(apiUrl, form).subscribe(
        (response: any) => {
          $t.sharedService.uiService.showApiSuccessPopMsg('User Avatar Updated...');
          $t.user.image = response.url;
          $t.authenticationService.login($t.user);
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
        }
      );
    } else {
      $t.sharedService.uiService.showApiErrorPopMsg(
        'Uploaded File is not a Valid Image. Only JPG, PNG and JPEG files are allowed.'
      );
    }
  }

  getNotifications() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getAllNotifications', { '{userId}': $t.user.email });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.notificationsData = response.responseObj;
        if ($t.notificationsData.length) {
          $('#notiRing').addClass('bell-ring');
          setTimeout(() => {
            $('#notiRing').removeClass('bell-ring');
          }, 2000);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getNotiCount() {
    return this.notificationsData.length;
  }

  onClickOfSellAllNoti() {
    $(this).toggleClass('open');
    $('#notificationMenu').toggleClass('open');
  }

  notiRedirect(_noti: any) {
    if (_noti.jobId !== '') {
      this.router.navigate(['/job/' + _noti.jobId], { replaceUrl: true });
    } else if (_noti.courseId !== '') {
      this.router.navigate(['/course/' + _noti.courseId], { replaceUrl: true });
    }
    this.onClickOfSellAllNoti();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit() {
    if (this.user && this.user.email) {
      setInterval(() => {
        this.getNotifications();
      }, 300000);
    }
    if (this.sharedService.deviceDetectorService.isMobile()) {
      $('.page-wrapper').removeClass('toggled');
    }
    this.sharedService.utilityService.currentMessage.pipe(untilDestroyed(this)).subscribe((message) => {
      if (message === 'TRIGGER-HEADER-NOTIFICATIONS-UPDATE') {
        this.getNotifications();
      }
    });
  }

  ngOnDestroy(): void {}

  ngAfterViewInit(): void {
    let $t = this;
    if (this.user && this.user.email) {
      $t.getNotifications();
    }
    $('.sidebar-dropdown > a').click(function () {
      $('.sidebar-submenu').slideUp(200);
      if ($(this).parent().hasClass('active')) {
        $('.sidebar-dropdown').removeClass('active');
        $(this).parent().removeClass('active');
      } else {
        $('.sidebar-dropdown').removeClass('active');
        $(this).next('.sidebar-submenu').slideDown(200);
        $(this).parent().addClass('active');
      }
    });

    $('#close-sidebar').click(function () {
      $('.page-wrapper').removeClass('toggled');
    });
    $('#show-sidebar').click(function () {
      $('.page-wrapper').addClass('toggled');
    });

    $('.menu-item').on('click', () => {
      if ($t.sharedService.deviceDetectorService.isMobile()) {
        $('.page-wrapper').removeClass('toggled');
      }
    });

    $('.notification-popup').click(function () {
      $(this).toggleClass('open');
      $('#notificationMenu').toggleClass('open');
    });
  }
}
