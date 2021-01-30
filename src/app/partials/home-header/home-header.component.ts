import { Component, OnInit } from '@angular/core';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { Router } from '@angular/router';
import { courseSearchData, jobsSearchData } from '@app/models/constants';

//extra
declare var jQuery: any;

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
})
export class HomeHeaderComponent implements OnInit {
  // courseConfig: any = {
  //   subjects: [],
  // };
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
  constructor(
    private router: Router,
    public sharedService: SharedService,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService
  ) {
    this.jobConfig.searchConfig = JSON.parse(JSON.stringify(jobsSearchData));
    this.courseConfig.searchConfig = JSON.parse(JSON.stringify(courseSearchData));
    if(this.user){
      this.user.type.toLowerCase() === 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
    }
  }

  globalSearch() {
    let $t = this;
    if ($t.globalSearchType === 'profile') {
      $t.userSearch();
    }
    if ($t.globalSearchType === 'organization') {
      $t.orgSearch();
    }
    if ($t.globalSearchType === 'job') {
      $t.jobSearch();
    }
    if ($t.globalSearchType === 'course') {
      $t.courseSearch();
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
    this.authenticationService.openLoginPopup();
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

  ngOnInit(): void {
    this.fetchCourseFilter();
  }

  ngAfterViewInit(): void {
    jQuery('#mainmenu-area').sticky({
      topSpacing: 0,
    });
  }
}
