import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { filter, delay } from 'rxjs/operators';
import { jobsSearchData } from '@app/models/constants';
import { untilDestroyed } from '@app/@core';

// service
import { SharedService } from '@app/services/shared.service';
import { CredentialsService, AuthenticationService } from '@app/auth';

//popups
import { JobsApplyPopupComponent } from '@app/partials/popups/jobs/jobs-apply-popup/jobs-apply-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-job-listings',
  templateUrl: './all-job-listings.component.html',
  styleUrls: ['./all-job-listings.component.scss'],
})
export class AllJobListingsComponent implements OnInit {
  @ViewChild('filterDrawer', { static: false }) filterDrawer: any;
  uds: any;
  isLoading: boolean = true;
  length = 100;
  pageSize = 20;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  pageEvent: PageEvent;
  filterData: any = {
    tiers: [],
    categories: [],
    levels: ['Introductory', 'Beginner', 'Intermediate', 'Advanced'],
    languages: [],
    subjects: [],
    programs: [],
  };
  isAdmin: boolean = false;
  searchConfig: any = {};
  panelOpenState: boolean = false;
  allJobs: any = [];
  countries: any = [];
  currentView = 1;
  private currMsgSubscribe = new Subscription();
  recommendedCourses:any = {
    isFetching : false,
    data:[]
  }
  recommendedJobs:any = {
    isFetching : false,
    data:[]
  }
  constructor(
    public sharedService: SharedService,
    public router: Router,
    public credentialsService: CredentialsService,
    public authenticationService: AuthenticationService
  ) {
    this.searchConfig = JSON.parse(JSON.stringify(jobsSearchData));
    this.uds = this.sharedService.plugins.undSco;
    this.user && this.user.type.toLowerCase() === 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
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

  changeAssetView(_view: number) {
    this.currentView = _view;
    setTimeout(() => {
      if (this.currentView === 1) {
      } else if (this.currentView === 2) {
      }
    }, 1);
  }

  viewJob(job: any) {
    this.router.navigate(['/job/' + job.id], { replaceUrl: true });
  }

  applyFilter(_pageIndex?: number) {
    let $t = this;
    if ($t.sharedService.deviceDetectorService.isMobile()) {
      $t.filterDrawer.toggle();
    }
    $t.isLoading = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchJobs', {
      '{page}': _pageIndex || 1,
      '{size}': this.pageSize,
    });
    $t.sharedService.configService.post(apiUrl, $t.searchConfig).subscribe(
      (response: any) => {
        $t.allJobs = response.responseObj.jobs;
        $t.length = response.responseObj.count;
        $t.isLoading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  saveJobs(job: any) {
    let $t = this;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('saveJob', {
      '{userId}': $t.user.email,
      '{jobId}': job.id,
    });
    $t.sharedService.uiService.showApiStartPopMsg('Saving Job...');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        if ($t.user) {
          $t.user['savedJobs'].push(job);
          $t.user['savedJobs'] = $t.uds.uniq($t.user['savedJobs'], (d: any) => {
            return d.id;
          });
          $t.authenticationService.login(this.user);
        }
        job.isSaved = true;
        $t.sharedService.uiService.showApiSuccessPopMsg('Job Saved...');
      },
      (error) => {
        console.log(error);
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  removeSaveJobs(job: any, event: any) {
    event.stopPropagation();
    event.preventDefault();
    let $t = this;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('saveJob', {
      '{userId}': $t.user.email,
      '{jobId}': job.id,
    });
    $t.sharedService.uiService.showApiStartPopMsg('Removing Job...');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        if ($t.user) {
          $t.user['savedJobs'] = $t.user['savedJobs'].filter((d: any) => d.id !== job.id);
          $t.authenticationService.login(this.user);
        }
        job.isSaved = false;
        $t.sharedService.uiService.showApiSuccessPopMsg('Job Removed...');
      },
      (error) => {
        console.log(error);
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  checkFilter() {
    return Object.values(this.searchConfig).filter((d) => d !== '' && d !== 0).length;
  }

  removeFilter() {
    this.searchConfig = JSON.parse(JSON.stringify(jobsSearchData));
    this.getJobs(1);
  }

  pagination(event: any): any {
    this.pageSize = event.pageSize;
    if (this.checkFilter()) {
      this.applyFilter(event.pageIndex + 1);
    } else {
      this.getJobs(event.pageIndex + 1);
    }
  }

  selectCourse(event: any, course: any) {
    event.stopPropagation();
    event.preventDefault();
    course['isSelected'] = course['isSelected'] ? !course['isSelected'] : true;
  }

  init() {
    this.getJobs(1);
    this.getJobCount();
    this.getCountry();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  getJobCount() {
    let apiUrl = this.sharedService.urlService.simpleApiCall('getJobsCount');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.length = response.responseObj;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getJobs(_pageIndex: any) {
    this.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getAllJobs', {
      '{page}': 1,
      '{size}': this.pageSize,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.allJobs = response.responseObj;
        let savedJobIdArr = this.user.savedJobs.map((d: any) => d.id);
        this.uds.each(this.allJobs, (d: any) => {
          this.uds.each(d.applicants, (app: any) => {
            d['isApplied'] = app.userId === this.user.email && app.status !== 'Withdrawn';
            app.userId === this.user.email ? (d['applicantStatus'] = app.status) : null;
            d['isSaved'] = savedJobIdArr.includes(d.id) ? true : false;
          });
        });
        console.log(this.allJobs);
        this.length = response.responseObj.length;
        this.isLoading = false;
        if (!this.sharedService.deviceDetectorService.isMobile()) {
          this.filterDrawer.open();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCountry() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getCountry');

    $t.sharedService.configService.get(apiUrl).subscribe((response) => {
      $t.countries = response;
    });
  }

  applyForJob(_course: any, _event: any) {
    this.sharedService.dialogService.open(JobsApplyPopupComponent, {
      width: '50%',
      data: {
        applyingForJob: _course,
        user: this.user,
        waitTillSubmit: true,
      },
    });
  }

  ngOnInit(): void {
    this.getRecommendedCourses();
    this.sharedService.utilityService.requiredStyleForHomeHeader();
    window.scrollTo(0, 0);
    this.init();

    this.currMsgSubscribe = this.sharedService.utilityService.currentMessage
      .pipe(delay(10), untilDestroyed(this))
      .subscribe((message) => {
        if (message == 'REFRESH-ALL-JOBS') {
          this.init();
        }
      });
  }

  ngOnDestroy(): void {
    this.currMsgSubscribe.unsubscribe();
  }
}
