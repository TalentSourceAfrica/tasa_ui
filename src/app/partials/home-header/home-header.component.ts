import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { Router } from '@angular/router';
import { courseSearchData, jobsSearchData } from '@app/models/constants';
import { CartService } from '@app/scenes/cart/cart.service';

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
  searchCourseText: any = '';
  searchGlobalText: any = '';
  globalSearchType = 'course';
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
  constructor(
    private router: Router,
    public sharedService: SharedService,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private cartService: CartService
  ) {
    this.jobConfig.searchConfig = JSON.parse(JSON.stringify(jobsSearchData));
    this.courseConfig.searchConfig = JSON.parse(JSON.stringify(courseSearchData));
    if (this.user) {
      this.user.type.toLowerCase() === 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
    }
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

  showProfile(tasaId: string) {
    this.router.navigate(['/social-network/profile/', tasaId], { replaceUrl: true });
    this.sharedService.utilityService.changeMessage('FETCH-USER-PROFILE');
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

  onCourseSearch(_type: string, _val?: string) {
    if (_type === 'text') {
      this.sharedService.utilityService.onCourseSearch(this.searchCourseText, _type);
    } else {
      this.sharedService.utilityService.onCourseSearch(_val, _type);
    }
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
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

  setNotificationData(event: any, _type: string) {
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
    this.fetchCourseFilter();
    setInterval(() => {
      this.getNotifications();
    }, 300000);
    setTimeout(() => {
      jQuery('.notification-popup').click((event: any) => {
        jQuery(this).toggleClass('open');
        jQuery('#notificationMenu').removeClass('d-none').toggleClass('open');
      });
      jQuery(document).on('click', (event: any) => {
        if (!jQuery(event.target).closest('.notification-popup').length) {
          if (jQuery('#notificationMenu').hasClass('open')) {
            jQuery('#notificationMenu').addClass('d-none').toggleClass('open');
          }
        }
      });
    }, 5000);
  }

  ngAfterViewInit(): void {
    jQuery('#mainmenu-area').sticky({
      topSpacing: 0,
    });
  }
}
