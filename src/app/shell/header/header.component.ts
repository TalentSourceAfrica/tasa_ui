import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

// services
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { delay } from 'underscore';
import { untilDestroyed } from '@app/@core';
import { courseSearchData, jobsSearchData } from '@app/models/constants';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('file', { static: false }) public file: any;
  @ViewChild('audioOption', { static: false }) audioPlayerRef: ElementRef;
  isAdmin: boolean = false;
  searchCourseText: string = '';
  notificationConfig: any = {
    messageCount: 0,
    messageNotifications: [],
    otherCount: 0,
    otherNotifications: [],
    currentView: 0, //  0 = other notifcations , 1 = message notifications;
  };
  notificationsData: any = [];
  searchGlobalText: any = '';
  globalSearchType = 'course';
  userSearchConfig: any = {
    isFetching: false,
    data: [],
  };
  orgConfig: any = {
    isFetching: false,
    data: [],
  };
  jobConfig: any = {
    isFetching: false,
    data: [],
    searchConfig: '',
  };
  courseConfig: any = {
    isFetching: false,
    data: [],
    searchConfig: '',
  };
  freelanceConfig: any = {
    isFetching: false,
    data: [],
    searchConfig: ''
  }
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    public sharedService: SharedService
  ) {
    this.jobConfig.searchConfig = JSON.parse(JSON.stringify(jobsSearchData));
    this.courseConfig.searchConfig = JSON.parse(JSON.stringify(courseSearchData));
    if (this.user) {
      this.user.type.toLowerCase() === 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
    }
  }

  gsVal() {
    if (typeof this.searchGlobalText === 'object') {
      switch (this.globalSearchType) {
        case 'profile':
          this.searchGlobalText = this.searchGlobalText.firstName + ' ' + this.searchGlobalText.lastName;
          break;
        case 'job':
          this.searchGlobalText = this.searchGlobalText.title;
          break;
        case 'organization':
          this.searchGlobalText = this.searchGlobalText.orgName;
          break;
        case 'course':
          this.searchGlobalText = this.searchGlobalText.title;
          break;
      }
    }
  }

  globalSearch() {
    let $t = this;
    switch($t.globalSearchType) {
        case 'profile':
          $t.userSearch();
          break;
        case 'organization':
          $t.orgSearch();
          break;
        case 'job':
          $t.jobSearch();
          break;
        case 'course':
          $t.courseSearch();
          break;
        case 'freelance':
          $t.freeLanceSearch();
          break;        
    }
  }

  userSearch() {
    let $t = this;
    $t.userSearchConfig.isFetching = true;
    $t.userSearchConfig.data = [];
    if ($t.searchGlobalText != '') {
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchUser', {
        '{page}': 1,
        '{size}': 50,
        '{searchText}': $t.searchGlobalText,
      });
      $t.sharedService.configService.post(apiUrl).subscribe(
        (response: any) => {
          $t.userSearchConfig.isFetching = false;
          $t.userSearchConfig.data = response.responseObj;
          $('#globalSearchInput').focus();
        },
        (error) => {
          $t.userSearchConfig.isFetching = false;
          $t.userSearchConfig.data = [];
        }
      );
    }
  }

  orgSearch() {
    let $t = this;
    $t.orgConfig.isFetching = true;
    $t.orgConfig.data = [];
    if ($t.searchGlobalText != '') {
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchOrganization', {
        '{page}': 1,
        '{size}': 50,
        '{searchText}': $t.searchGlobalText,
      });
      $t.sharedService.configService.post(apiUrl).subscribe(
        (response: any) => {
          $t.orgConfig.isFetching = false;
          $t.orgConfig.data = response.responseObj;
          $('#globalSearchInput').focus();
        },
        (error) => {
          $t.orgConfig.isFetching = false;
          $t.orgConfig.data = [];
        }
      );
    }
  }

  jobSearch() {
    let $t = this;
    $t.jobConfig.isFetching = true;
    $t.jobConfig.data = [];
    if ($t.searchGlobalText != '') {
      $t.jobConfig.searchConfig.text = $t.searchGlobalText;
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchJobs', {
        '{page}': 1,
        '{size}': 50,
      });
      $t.sharedService.configService.post(apiUrl, $t.jobConfig.searchConfig).subscribe(
        (response: any) => {
          $t.jobConfig.isFetching = false;
          $t.jobConfig.data = response.responseObj.jobs;
          $('#globalSearchInput').focus();
        },
        (error) => {
          $t.jobConfig.isFetching = false;
          $t.jobConfig.data = [];
        }
      );
    }
  }

  courseSearch() {
    let $t = this;
    $t.courseConfig.isFetching = true;
    $t.courseConfig.data = [];
    if ($t.searchGlobalText != '') {
      $t.courseConfig.searchConfig.text = $t.searchGlobalText;
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchCourse', {
        '{page}': 1,
        '{size}': 50,
      });
      $t.sharedService.configService.post(apiUrl, $t.jobConfig.searchConfig).subscribe(
        (response: any) => {
          $t.courseConfig.isFetching = false;
          $t.courseConfig.data = response.responseObj.courses;
          $('#globalSearchInput').focus();
        },
        (error) => {
          $t.courseConfig.isFetching = false;
          $t.courseConfig.data = [];
        }
      );
    }
  }

  freeLanceSearch() {
    let $t = this;
    $t.freelanceConfig.isFetching = true;
    $t.freelanceConfig.data = [];
    if ($t.searchGlobalText != '') {
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchFreelancer', {
        '{page}': 1,
        '{size}': 50,
        '{searchText}': $t.searchGlobalText,
      });
      $t.sharedService.configService.post(apiUrl).subscribe(
        (response: any) => {
          $t.freelanceConfig.isFetching = false;
          $t.freelanceConfig.data = response.responseObj;
          $('#globalSearchInput').focus();
        },
        (error) => {
          $t.freelanceConfig.isFetching = false;
          $t.freelanceConfig.data = [];
        }
      );
    }
  }

  redirect(_type: string, _id?: string) {
    switch (_type) {
      case 'job':
        this.router.navigate(['/job/', _id], { replaceUrl: true });
        setTimeout(() => {
          this.sharedService.utilityService.changeMessage('FETCH-JOB-DETAILS');
        }, 500);
        break;
      case 'course':
        this.router.navigate(['/course/', _id], { replaceUrl: true });
        setTimeout(() => {
          this.sharedService.utilityService.changeMessage('FETCH-COURSE-DETAILS');
        }, 500);
        break;
    }
  }

  onCourseSearch() {
    this.sharedService.utilityService.onCourseSearch(this.searchCourseText, 'text');
  }

  logout() {
    let _callback = () => {
      this.sharedService.uiService.showApiSuccessPopMsg('Logout Successfully...!');
      setTimeout(() => {
        this.sharedService.uiService.closePopMsg();
        this.credentialsService.deleteAllCookies();
        this.authenticationService.logout().subscribe(() => this.router.navigate(['/home'], { replaceUrl: true }));
      }, 1000);
    };
    this.sharedService.uiService.showPreConfirmPopMsg('You Want To Logout', _callback);
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
    if ($t.user && $t.user.email) {
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('getNewNotifications', { '{userId}': $t.user.email });
      $t.sharedService.configService.get(apiUrl).subscribe(
        (response: any) => {
          $t.notificationConfig.messageNotifications = response.responseObj.filter((d: any) => d.messageId !== '');
          $t.notificationConfig.messageCount = $t.notificationConfig.messageNotifications.length;
          $t.notificationConfig.otherNotifications = response.responseObj.filter((d: any) => d.messageId === '');
          $t.notificationConfig.otherCount = $t.notificationConfig.otherNotifications.length;
          if ($t.notificationsData.length) {
            // $t.audioPlayerRef.nativeElement.play();
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
  }

  getNotiCount() {
    return this.notificationsData.length;
  }

  onClickOfSellAllNoti() {
    $(this).toggleClass('open');
    $('#notificationMenu').toggleClass('open');
  }

  notiRedirect(_noti: any, _notiIndex: number) {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('readNotification', { '{notificationId}': _noti.id });
    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {},
      (error) => {
        console.log(error);
      }
    );
    $t.notificationsData.splice(_notiIndex, 1);
    if (_noti.jobId !== '') {
      this.router.navigate(['/job/' + _noti.jobId], { replaceUrl: true });
    } else if (_noti.courseId !== '') {
      this.router.navigate(['/course/' + _noti.courseId], { replaceUrl: true });
    } else if (_noti.connRequestId !== '') {
      this.router.navigate(['/social-network/network/'], { replaceUrl: true });
    } else if (_noti.messageId !== '') {
      this.router.navigate(['/social-network/conversation/'], {
        replaceUrl: true,
        queryParams: { userId: _noti.from },
      });
    }

    this.onClickOfSellAllNoti();
  }

  getNotiDay(_noti: any) {
    const dateofvisit = this.sharedService.plugins.mom(_noti.createdOn);
    const today = this.sharedService.plugins.mom();
    const day = today.diff(dateofvisit, 'days');
    if (day === 0) {
      return 'Today';
    } else {
      return day + ' Days Ago';
    }
  }

  routerSubscription() {
    this.router.events.subscribe((event: NavigationEnd) => {
      if (this.sharedService.deviceDetectorService.isMobile()) {
        $('#close-sidebar').click(() => {
          $('.page-wrapper').removeClass('toggled');
        });
      }
    });
  }

  showProfile(tasaId: string) {
    this.router.navigate(['/social-network/profile/', tasaId], { replaceUrl: true });
    this.sharedService.utilityService.changeMessage('VIEW-USER-PROFILE');
  }

  setNotificationData(_type: string) {
    if (_type === 'other') {
      this.notificationsData = this.notificationConfig.otherNotifications;
      this.notificationConfig.currentView = 0;
    } else {
      this.notificationsData = this.notificationConfig.messageNotifications;
      this.notificationConfig.currentView = 1;
    }
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit() {
    this.routerSubscription();
    // setInterval(() => {
    //   this.getNotifications();
    // }, 300000);

    if (this.sharedService.deviceDetectorService.isMobile()) {
      $('.page-wrapper').removeClass('toggled');
    }
    this.sharedService.utilityService.currentMessage.pipe(untilDestroyed(this)).subscribe((message) => {
      if (message === 'TRIGGER-HEADER-NOTIFICATIONS-UPDATE') {
        this.getNotifications();
      }
    });
  }

  ngAfterViewInit(): void {
    let $t = this;
    $t.getNotifications();
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

    $('.notification-popup').click((event: any) => {
      $(this).toggleClass('open');
      $('#notificationMenu').toggleClass('open');
    });

    $(document).on('click', (event: any) => {
      if (!$(event.target).closest('.notification-popup').length) {
        if ($('#notificationMenu').hasClass('open')) {
          $('#notificationMenu').toggleClass('open');
        }
      }
    });
  }

  ngOnDestroy(): void {}
}
