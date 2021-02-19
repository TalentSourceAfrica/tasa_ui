import { Component, OnInit } from '@angular/core';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-left-side',
  templateUrl: './left-side.component.html',
  styleUrls: ['./left-side.component.scss'],
})
export class LeftSideComponent implements OnInit {
  uds: any;
  isAdmin: boolean = false;
  allFavCourse: any = [];
  recentlyViewedCourse: any = [];
  savedJobs: any = [];
  recommendedSwitchInterval: any;
  recommendedSwitch: any = {
    course: true,
    jobs: false,
  };
  userActionSwitchInterval: any;
  userActionSwitch: any = {
    appliedJobs: true,
    favoriteCourse: false,
    recentlyViewedCourse: false,
    savedJobs: false,
  };
  recommendedCourses: any = {
    isFetching: false,
    data: [],
  };
  recommendedJobs: any = {
    isFetching: false,
    data: [],
  };
  jobApplications: any = [];
  isAllowedConfig: any = { allowed: true, message: '' }; // when user exceed the subscription plan
  constructor(
    public sharedService: SharedService,
    private credentialsService: CredentialsService,
    private authenticationService: AuthenticationService
  ) {
    this.uds = this.sharedService.plugins.undSco;
    if (this.user) {
      this.user.type.toLowerCase() === 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
      this.allFavCourse = this.user.favoriteCourses;
      this.recentlyViewedCourse = this.user.recentlyViewed;
      this.savedJobs = this.user.savedJobs;
    }
  }

  addToFavorite(_type: boolean, _course: any, event: any) {
    event.stopPropagation();
    event.preventDefault();
    let $t = this;
    if (_type) {
      $t.sharedService.uiService.showApiStartPopMsg('Adding To Favorite...');
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('favCourse', {
        '{userId}': $t.user.email,
        '{courseKey}': _course.key,
      });
      $t.sharedService.configService.get(apiUrl).subscribe(
        (response: any) => {
          _course['isFav'] = true;
          $t.user['favoriteCourses'].push({
            image_url: _course.image_url,
            key: _course.key,
            subject: _course.subjects,
            title: _course.title,
            program: '',
          });
          $t.user['favoriteCourses'] = $t.uds.uniq($t.user['favoriteCourses'], (d: any) => {
            return d.key;
          });
          $t.authenticationService.login(this.user);
          $t.sharedService.uiService.showApiSuccessPopMsg('Added To Favorite...');
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    } else {
      $t.sharedService.uiService.showApiStartPopMsg('Removing From Favorite...');
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('unfavCourse', {
        '{userId}': $t.user.email,
        '{courseKey}': _course.key,
      });
      $t.sharedService.configService.get(apiUrl).subscribe(
        (response: any) => {
          _course['isFav'] = false;
          $t.user['favoriteCourses'] = $t.user['favoriteCourses'].filter((d: any) => d.key != _course.key);
          $t.authenticationService.login(this.user);
          $t.sharedService.uiService.showApiSuccessPopMsg('Removed From Favorite...');
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    }
  }

  setLogicForRecommendedCard() {
    this.recommendedSwitchInterval = setInterval(() => {
      for (const property in this.recommendedSwitch) {
        this.recommendedSwitch[property] = !this.recommendedSwitch[property];
      }
    }, 10000);
  }

  setLogicForUserActionsCard() {
    this.userActionSwitchInterval = setInterval(() => {
      for (const property in this.userActionSwitch) {
        this.userActionSwitch[property] = !this.userActionSwitch[property];
        if (this.userActionSwitch[property]) {
          break;
        }
      }
    }, 10000);
  }

  clearIntervalForCard(_type: string) {
    switch (_type) {
      case 'recommended':
        this.recommendedSwitchInterval ? clearInterval(this.recommendedSwitchInterval) : null;
        break;
      case 'userAction':
        this.userActionSwitchInterval ? clearInterval(this.userActionSwitchInterval) : null;
        break;
    }
  }

  getRecommendedCourses() {
    let $t = this;
    let apiUrl = '';
    $t.isAllowedConfig.allowed = true;
    $t.recommendedCourses.isFetching = true;
    apiUrl = $t.sharedService.urlService.apiCallWithParams('getRecommendedCourses', { '{userId}': $t.user.email });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.recommendedCourses.data = response.responseObj;
        $t.recommendedCourses.isFetching = false;
        $t.setLogicForRecommendedCard();
      },
      (error) => {
        if(error.status === '403'){
          $t.isAllowedConfig.allowed = false;
          $t.isAllowedConfig.message = error.error.message;
        }
        $t.recommendedCourses.isFetching = false;
      }
    );
  }

  getRecommendedJobs() {
    let $t = this;
    let apiUrl = '';
    $t.recommendedJobs.isFetching = true;
    apiUrl = $t.sharedService.urlService.apiCallWithParams('getRecommendedJobs', { '{userId}': $t.user.email });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.recommendedJobs.data = response.responseObj;
        $t.recommendedJobs.isFetching = false;
      },
      (error) => {
        $t.recommendedJobs.isFetching = false;
      }
    );
  }

  getJobsApplications() {
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getJobApplications', {
      '{userId}': this.user.email,
      '{page}': 0,
      '{size}': 0,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.jobApplications = response.responseObj;
        this.uds.each(this.jobApplications, (d: any) => {
          d['jobStatus'] = d.applicants.find((app: any) => app.userId == this.user.email).status;
        });
        this.setLogicForUserActionsCard();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    this.getRecommendedCourses();
    this.getRecommendedJobs();
    this.getJobsApplications();
  }
}
