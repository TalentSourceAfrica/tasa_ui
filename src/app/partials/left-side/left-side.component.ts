import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth';
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
  recommendedSwitch: any = {
    course: true,
    jobs: false,
  };
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

  constructor(public sharedService: SharedService, private credentialsService: CredentialsService) {
    this.uds = this.sharedService.plugins.undSco;
    if (this.user) {
      this.user.type.toLowerCase() === 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
      this.allFavCourse = this.user.favoriteCourses;
      this.recentlyViewedCourse = this.user.recentlyViewed;
      this.savedJobs = this.user.savedJobs;
    }
  }

  setLogicForRecommendedCard() {
    setInterval(() => {
      for (const property in this.recommendedSwitch) {
        this.recommendedSwitch[property] = !this.recommendedSwitch[property];
      }
    }, 5000);
  }

  setLogicForUserActionsCard() {
    setInterval(() => {
      for (const property in this.userActionSwitch) {
        this.userActionSwitch[property] = !this.userActionSwitch[property];
        if (this.userActionSwitch[property]) {
          break;
        }
      }
    }, 5000);
  }

  getRecommendedCourses() {
    let $t = this;
    let apiUrl = '';
    $t.recommendedCourses.isFetching = true;
    apiUrl = $t.sharedService.urlService.apiCallWithParams('getRecommendedCourses', { '{userId}': $t.user.email });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.recommendedCourses.data = response.responseObj;
        $t.recommendedCourses.isFetching = false;
        $t.setLogicForRecommendedCard();
      },
      (error) => {
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
