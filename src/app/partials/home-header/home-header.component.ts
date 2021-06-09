import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { Router } from '@angular/router';
import { courseSearchData, jobsSearchData } from '@app/models/constants';
import { CartService } from '@app/scenes/cart/cart.service';
import { untilDestroyed } from '@app/@core';
import { fromEvent } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';

//extra
declare var jQuery: any;

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
})
export class HomeHeaderComponent implements OnInit {
  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
    this.processData();
  }
  @ViewChild('file', { static: false }) public file: any;
  @ViewChild('globalSearchInput', { static: false }) public globalSearchInput: ElementRef;

  notificationConfig: any = {
    messageCount: 0,
    messageNotifications: [],
    otherCount: 0,
    otherNotifications: [],
    currentView: 0, //  0 = other notifcations , 1 = message notifications;
  };
  notificationsData: any = [];
  isAdmin: boolean = false;
  menuHidden = true;
  searchGlobalText: any = '';
  globalSearchType = 'profile';
  orgConfig: any = {
    isFetching: false,
    data: [],
  };
  userSearchConfig: any = {
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
    searchConfig: '',
  };

  // search config before login
  searchTextBeforeLogin: any = '';
  public searchDropdownValue = [
    {
      name: 'Course',
      value: 'course',
      placeholder: 'Type computer science, design, finance...',
    },
    {
      name: 'Gig',
      value: 'gig',
      placeholder: 'Type content, web development, data analyst...',
    },
    {
      name: 'Job',
      value: 'job',
      placeholder: 'Type architect, data analyst...',
    },
  ];
  selectedSearchDrp = this.searchDropdownValue[0];
  constructor(
    private router: Router,
    public sharedService: SharedService,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private cartService: CartService,
    public cdr: ChangeDetectorRef
  ) {
    this.jobConfig.searchConfig = JSON.parse(JSON.stringify(jobsSearchData));
    this.courseConfig.searchConfig = JSON.parse(JSON.stringify(courseSearchData));
  }

  processData() {
    localStorage.setItem('cartConfig', JSON.stringify(this.cartService.fetchData()));
  }

  globalSearch() {
    let $t = this;
    switch ($t.globalSearchType) {
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
      case 'group':
        $t.groupSearch();
        break;
    }
  }

  userSearch() {
    let $t = this;

    $t.userSearchConfig.data = [];
    if ($t.searchGlobalText != '') {
      $t.userSearchConfig.isFetching = true;
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchUser', {
        '{page}': 1,
        '{size}': 50,
        '{searchText}': $t.searchGlobalText,
      });
      $t.sharedService.configService.post(apiUrl).subscribe(
        (response: any) => {
          $t.userSearchConfig.isFetching = false;
          $t.userSearchConfig.data = response.responseObj;
          if ($t.userSearchConfig.data.length === 0) {
            $t.userSearchConfig.data.push({
              tasaId: '',
              isNoData: true,
            });
          }
          jQuery('#globalSearchInput').focus();
        },
        (error) => {
          $t.userSearchConfig.isFetching = false;
          $t.userSearchConfig.data = [];
        }
      );
    }
  }

  freeLanceSearch() {
    let $t = this;

    $t.freelanceConfig.data = [];
    if ($t.searchGlobalText != '') {
      $t.freelanceConfig.isFetching = true;
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchFreelancer', {
        '{page}': 1,
        '{size}': 50,
        '{searchText}': $t.searchGlobalText,
      });
      $t.sharedService.configService.post(apiUrl).subscribe(
        (response: any) => {
          $t.freelanceConfig.isFetching = false;
          $t.freelanceConfig.data = response.responseObj;

          if ($t.freelanceConfig.data.length === 0) {
            $t.freelanceConfig.data.push({
              tasaId: '',
              isNoData: true,
            });
          }
          jQuery('#globalSearchInput').focus();
        },
        (error) => {
          $t.freelanceConfig.isFetching = false;
          $t.freelanceConfig.data = [];
        }
      );
    }
  }

  groupSearch() {
    let $t = this;
    $t.userSearchConfig.data = [];
    if ($t.searchGlobalText != '') {
      $t.userSearchConfig.isFetching = true;
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchGroup', {
        '{searchText}': $t.searchGlobalText,
      });
      $t.sharedService.configService.post(apiUrl).subscribe(
        (response: any) => {
          $t.userSearchConfig.isFetching = false;
          $t.userSearchConfig.data = response.responseObj;
          if ($t.userSearchConfig.data.length === 0) {
            $t.userSearchConfig.data.push({
              id: '',
              isNoData: true,
            });
          }
          jQuery('#globalSearchInput').focus();
        },
        (error) => {
          $t.userSearchConfig.isFetching = false;
          $t.userSearchConfig.data = [];
        }
      );
    }
  }

  redirect(_type: string, _id?: string) {
    switch (_type) {
      case 'job':
        if (_id !== '') {
          this.router.navigate(['/job/', _id], { replaceUrl: true });
          setTimeout(() => {
            this.sharedService.utilityService.changeMessage('FETCH-JOB-DETAILS');
          }, 500);
        }
        break;
      case 'course':
        if (_id !== '') {
          this.router.navigate(['/course/', _id], { replaceUrl: true });
          setTimeout(() => {
            this.sharedService.utilityService.changeMessage('FETCH-COURSE-DETAILS');
          }, 500);
        }
        break;
    }
  }

  gsVal() {
    if (typeof this.searchGlobalText === 'object') {
      if (this.searchGlobalText.isNoData) {
        this.searchGlobalText = '';
      } else {
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
          case 'group':
            this.searchGlobalText = this.searchGlobalText.title;
            break;
        }
      }
    }
  }

  showProfile(tasaId: string) {
    if (tasaId && tasaId !== '') {
      this.router.navigate(['/social-network/profile/', tasaId], { replaceUrl: true });
      this.sharedService.utilityService.changeMessage('VIEW-USER-PROFILE');
    }
  }

  orgSearch() {
    let $t = this;

    $t.orgConfig.data = [];
    if ($t.searchGlobalText != '') {
      $t.orgConfig.isFetching = true;
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchOrganization', {
        '{page}': 1,
        '{size}': 50,
        '{searchText}': $t.searchGlobalText,
      });
      $t.sharedService.configService.post(apiUrl).subscribe(
        (response: any) => {
          $t.orgConfig.isFetching = false;
          $t.orgConfig.data = response.responseObj;
          jQuery('#globalSearchInput').focus();
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

    $t.jobConfig.data = [];
    if ($t.searchGlobalText != '') {
      $t.jobConfig.isFetching = true;
      $t.jobConfig.searchConfig.text = $t.searchGlobalText;
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchJobs', {
        '{page}': 1,
        '{size}': 50,
      });
      $t.sharedService.configService.post(apiUrl, $t.jobConfig.searchConfig).subscribe(
        (response: any) => {
          $t.jobConfig.isFetching = false;
          $t.jobConfig.data = response.responseObj.jobs;
          if ($t.jobConfig.data.length === 0) {
            $t.jobConfig.data.push({
              id: '',
              isNoData: true,
            });
          }
          jQuery('#globalSearchInput').focus();
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

    $t.courseConfig.data = [];
    if ($t.searchGlobalText != '') {
      $t.courseConfig.isFetching = true;
      $t.courseConfig.searchConfig.text = $t.searchGlobalText;
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchCourse', {
        '{page}': 1,
        '{size}': 50,
      });
      $t.sharedService.configService.post(apiUrl, $t.courseConfig.searchConfig).subscribe(
        (response: any) => {
          $t.courseConfig.isFetching = false;
          $t.courseConfig.data = response.responseObj.courses;
          if ($t.courseConfig.data.length === 0) {
            $t.courseConfig.data.push({
              key: '',
              isNoData: true,
            });
          }
          jQuery('#globalSearchInput').focus();
        },
        (error) => {
          $t.courseConfig.isFetching = false;
          $t.courseConfig.data = [];
        }
      );
    }
  }

  handleFileInput(event: any) {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadUserImage', { '{email}': $t.user.email });
    apiUrl = $t.sharedService.urlService.addQueryStringParm(apiUrl, 'profile', true);
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
          $t.sharedService.utilityService.changeMessage('FETCH-USER-PROFILE');
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

  signup(_case: string) {
    this.authenticationService.openSignupPopup(_case);
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
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
    this.authenticationService.openSignupPopup('sign-in');
  }

  callUpload(event: any) {
    event.stopPropagation();
    event.preventDefault();
    this.file.nativeElement.click();
  }

  partnerWithUs() {
    this.sharedService.utilityService.changeMessage('PARTNER-WITH-US');
    this.router.navigate(['/contact-us'], { replaceUrl: true });
  }

  userDetails() {
    this.authenticationService.openUserDetailsPopup();
  }

  scrollToFaq(_id: string) {
    this.sharedService.utilityService.scrollToElement(_id);
  }

  onSearch() {
    switch (this.selectedSearchDrp.value) {
      case 'course':
        this.onCourseSearch('text');
        break;
      case 'job':
        this.sharedService.utilityService.onJobSearch(this.searchTextBeforeLogin);
        break;
      case 'gig':
        this.sharedService.utilityService.onGigSearch(this.searchTextBeforeLogin);
        break;
    }
  }

  onCourseSearch(_type: string, _val?: string) {
    if (_type === 'text') {
      this.sharedService.utilityService.onCourseSearch(this.searchTextBeforeLogin, _type);
    } else {
      this.sharedService.utilityService.onCourseSearch(_val, _type);
    }
  }

  fetchCourseFilter() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getFiltersData');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.courseConfig.subjects = response.responseObj.subjects;
      },
      (error) => {
        console.log(error);
      }
    );
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
    $t.notificationConfig.messageNotifications = $t.notificationsData.filter((d: any) => d.messageId !== '');
    $t.notificationConfig.messageCount = $t.notificationConfig.messageNotifications.length;
    $t.notificationConfig.otherNotifications = $t.notificationsData.filter((d: any) => d.messageId === '');
    $t.notificationConfig.otherCount = $t.notificationConfig.otherNotifications.length;

    if (_noti.jobId !== '') {
      this.router.navigate(['/job/' + _noti.jobId], { replaceUrl: true });
    } else if (_noti.courseId !== '') {
      this.router.navigate(['/course/' + _noti.courseId], { replaceUrl: true });
    } else if (_noti.connRequestId !== '') {
      this.router.navigate(['/social-network/network/'], { replaceUrl: true });
    } else if (_noti.postId !== '') {
      this.router.navigate(['/social-network/posts/'], { replaceUrl: true });
    } else if (_noti.messageId !== '') {
      this.router.navigate(['/social-network/conversation/'], {
        replaceUrl: true,
        queryParams: { userId: _noti.from },
      });
    }
    this.onClickOfSellAllNoti();
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
          $t.cdr.detectChanges();
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

  ngOnInit(): void {
    let $t = this;
    this.fetchCourseFilter();
    setInterval(() => {
      this.getNotifications();
    }, 300000);

    this.sharedService.utilityService.currentMessage.pipe(untilDestroyed(this)).subscribe((message) => {
      if (message === 'TRIGGER-HEADER-NOTIFICATIONS-UPDATE') {
        this.getNotifications();
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.user) {
      this.user.type.toLowerCase() === 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
    }
    this.getNotifications();
    jQuery('#mainmenu-area').sticky({
      topSpacing: 0,
    });
    jQuery('#main-nav').stellarNav({
      theme: 'dark',
      scrollbarFix: true,
      breakpoint: 900,
    });

    // global search

    fromEvent(this.globalSearchInput.nativeElement, 'keyup')
      .pipe(
        // get value
        map((event: any) => {
          return event.target.value;
        }),
        filter((res) => res.length >= 0),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        this.globalSearch();
      });
  }

  ngOnDestroy(): void {}

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
