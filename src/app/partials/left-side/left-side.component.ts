import { Component, OnInit } from '@angular/core';
import { untilDestroyed } from '@app/@core';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { delay } from 'rxjs/operators';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { object } from 'underscore';

//extra
declare var jQuery: any;

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
  isAllowedJobConfig: any = { allowed: true, message: '' }; // when user exceed the subscription plan
  userProgressConfig: any = {
    percent: 0,
    radius: 60,
    color: 'primary',
    bufferValue: 75,
    mode: 'buffer',
    outerColor: '#523f6d',
    innerColor: '#a39ab238',
    title: 'Complete',
    totalCommonFields: [
      {
        filedName: 'bio',
        isValuePresent: false,
      },
      {
        filedName: 'areaOfPreference',
        isValuePresent: false,
      },
      {
        filedName: 'careerGoals',
        isValuePresent: false,
      },
      {
        filedName: 'experience',
        isValuePresent: false,
        totalInsideFields: 3,
      },
      {
        filedName: 'education',
        isValuePresent: false,
        totalInsideFields: 4,
      },
      {
        filedName: 'certificate',
        isValuePresent: false,
      },
      {
        filedName: 'city',
        isValuePresent: false,
      },
      {
        filedName: 'state',
        isValuePresent: false,
      },
      {
        filedName: 'country',
        isValuePresent: false,
      },
    ],
  };

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
      // $t.sharedService.uiService.showApiStartPopMsg('Adding To Favorite...');
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('favCourse', {
        '{userId}': $t.user.email,
        '{courseKey}': _course.key,
      });
      _course['favorite'] = true;
      $t.sharedService.configService.get(apiUrl).subscribe(
        (response: any) => {
          _course['favorite'] = true;
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
          // $t.sharedService.uiService.showApiSuccessPopMsg('Added To Favorite...');
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    } else {
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('unfavCourse', {
        '{userId}': $t.user.email,
        '{courseKey}': _course.key,
      });
      _course['favorite'] = false;
      $t.sharedService.configService.get(apiUrl).subscribe(
        (response: any) => {
          _course['favorite'] = false;
          $t.user['favoriteCourses'] = $t.user['favoriteCourses'].filter((d: any) => d.key != _course.key);
          $t.authenticationService.login(this.user);
          // $t.sharedService.uiService.showApiSuccessPopMsg('Removed From Favorite...');
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
      const data = Object.keys(this.userActionSwitch);
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (this.userActionSwitch[element]) {
          let nextElement: any;
          index == data.length - 1 ? (nextElement = data[0]) : (nextElement = data[index + 1]);
          this.userActionSwitch[element] = !this.userActionSwitch[element];
          this.userActionSwitch[nextElement] = !this.userActionSwitch[nextElement];
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
        if (error.status == 403) {
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
    $t.isAllowedJobConfig.allowed = true;
    apiUrl = $t.sharedService.urlService.apiCallWithParams('getRecommendedJobs', { '{userId}': $t.user.email });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.recommendedJobs.data = response.responseObj;
        $t.recommendedJobs.isFetching = false;
      },
      (error) => {
        if (error.status == 403) {
          $t.isAllowedJobConfig.allowed = false;
          $t.isAllowedJobConfig.message = error.error.message;
        }
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

  checkOffset() {
    if (jQuery('#left-side-wrappert').offset()) {
      if (
        jQuery('#left-side-wrapper').offset().top + jQuery('#left-side-wrapper').height() >=
        jQuery('.footer-wrapper').offset().top - 10
      )
        jQuery('#left-side-wrapper').css('position', 'absolute');
      if (jQuery(document).scrollTop() + window.innerHeight < jQuery('.footer-wrapper').offset().top)
        jQuery('#left-side-wrapper').css('position', 'fixed');
    }
  }

  calculateProfileProgress() {
    let $t = this;
    if ($t.user.type === 'Mentee') {
      let totalFieldCount = $t.userProgressConfig.totalCommonFields.length;
      if ($t.user.isFreelancer === 'Y') {
        const freelanceFields = [
          {
            filedName: 'pastGigs',
            isValuePresent: false,
            totalInsideFields: 4,
          },
        ];
        $t.userProgressConfig.totalCommonFields = [...$t.userProgressConfig.totalCommonFields, ...freelanceFields];
      }

      $t.userProgressConfig.totalCommonFields.forEach((element: any) => {
        if (
          element.filedName === 'experience' ||
          element.filedName === 'pastGigs' ||
          element.filedName === 'areaOfPreference' ||
          element.filedName === 'education' ||
          element.filedName === 'certificate'
        ) {
          $t.user[element.filedName].length ? (element.isValuePresent = true) : (element.isValuePresent = false);
        } else {
          $t.user[element.filedName] !== '' ? (element.isValuePresent = true) : (element.isValuePresent = false);
        }
      });
      $t.userProgressConfig.percent =
        $t.userProgressConfig.totalCommonFields.filter((d: any) => d.isValuePresent).length / totalFieldCount;

      $t.userProgressConfig.percent = ($t.userProgressConfig.percent * 100).toFixed(2);

      if ($t.userProgressConfig.percent <= 50) {
        $t.userProgressConfig.outerColor = '#aa2b1d';
        $t.userProgressConfig.innerColor = '#fa1e0e';
      } else if ($t.userProgressConfig.percent > 50 && $t.userProgressConfig.percent <= 80) {
        $t.userProgressConfig.outerColor = '#025955';
        $t.userProgressConfig.innerColor = '#99bbad';
      } else if ($t.userProgressConfig.percent > 80) {
        $t.userProgressConfig.outerColor = '#523f6d';
        $t.userProgressConfig.innerColor = '#a39ab238';
      }
    }
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    this.getRecommendedCourses();
    this.getRecommendedJobs();
    this.getJobsApplications();

    this.calculateProfileProgress();
    this.sharedService.utilityService.currentMessage.pipe(delay(10), untilDestroyed(this)).subscribe((message) => {
      if (message === 'FETCH-USER-PROFILE') {
        this.calculateProfileProgress();
      }
    });

    // jQuery(document).scroll(() => {
    //   if (jQuery('.footer-wrapper').length) {
    //     this.checkOffset();
    //   } else {
    //     jQuery('#left-side-wrapper').css('position', 'fixed');
    //   }
    // });
  }

  ngOnDestroy(): void {}
}
