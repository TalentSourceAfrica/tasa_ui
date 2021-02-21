import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ShowApplicantsComponent } from '@app/partials/popups/recruiter/show-applicants/show-applicants.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isAdmin: boolean = false;
  uds: any;
  postData: any = [];
  courses: any = [];
  recommendedCourses: any = {
    isFetching: false,
    data: [],
  };
  recommendedJobs: any = {
    isFetching: false,
    data: [],
  };
  jobApplications: any = [];
  postOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    smartSpeed: 1000,
    dots: true,
    autoHeight: true,
    autoWidth: true,
    autoplayHoverPause: true,
    nav: false,
    navText: ["<i class='fas fa-3x fa-chevron-circle-left'></i>", "<i class='fas fa-3x fa-chevron-circle-right'></i>"],
    autoplayTimeout: 3000,
    responsive: {
      0: {
        items: 1,
      },
    },
  };

  courseOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    smartSpeed: 1000,
    dots: true,
    autoHeight: true,
    autoWidth: false,
    autoplayHoverPause: true,
    nav: false,
    navText: ["<i class='fas fa-3x fa-chevron-circle-left'></i>", "<i class='fas fa-3x fa-chevron-circle-right'></i>"],
    autoplayTimeout: 3000,
    responsive: {
      0: {
        items: 1,
      },
      300: {
        items: 2,
      },
      600: {
        items: 3,
      },
      900: {
        items: 4,
      },
    },
  };
  matTableConfig: any = {
    data: [],
    cols: [
      'organization',
      'title',
      'createdBy',
      'applicationReceivedCount',
      'applicationRejectedCount',
      'applicationAcceptedCount',
    ],
    resultsLength: 0,
  };
  matTabData: any = [];

  isAllowedCourseConfig: any = { allowed: true, message: '' }; // when user exceed the subscription plan
  isAllowedJobConfig: any = { allowed: true, message: '' }; // when user exceed the subscription plan

  constructor(
    public sharedService: SharedService,
    private router: Router,
    private credentialsService: CredentialsService
  ) {
    this.user.type.toLowerCase() == 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
    this.uds = this.sharedService.plugins.undSco;
  }

  showApplicants(job: any, event: any, applicantStatus: string) {
    event.stopPropagation();
    event.preventDefault();
    this.sharedService.dialogService.open(ShowApplicantsComponent, {
      width: '80%',
      data: {
        job: job,
        user: this.user,
        applicantStatus: applicantStatus,
        fromWhere: 'rec-dashboard'
      },
      disableClose: false,
    });
  }

  getJobsForOrganization() {
    let $t = this;
    let api = $t.sharedService.urlService.apiCallWithParams('getJobsByOrg', {
      '{orgId}': $t.user.orgId,
    });
    $t.sharedService.configService.get(api).subscribe(
      (response: any) => {
        $t.matTableConfig.data = response.responseObj;
        $t.matTableConfig.resultsLength = $t.matTableConfig.data.length;
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error);
      }
    );
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  getPosts() {
    let $t = this;
    let apiUrl = '';
    apiUrl = $t.sharedService.urlService.simpleApiCall('getPost');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.postData = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCourses() {
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getCourse', {
      '{page}': 1,
      '{size}': 10,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.courses = response.responseObj;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  courseView(_key: any) {
    this.router.navigate(['/course/' + _key], { replaceUrl: true });
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
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getRecommendedCourses() {
    let $t = this;
    let apiUrl = '';
    $t.recommendedCourses.isFetching = true;
    $t.isAllowedCourseConfig.allowed = true;
    apiUrl = $t.sharedService.urlService.apiCallWithParams('getRecommendedCourses', { '{userId}': $t.user.email });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.recommendedCourses.data = response.responseObj;
        $t.recommendedCourses.isFetching = false;
      },
      (error) => {
        if(error.status == 403){
          $t.isAllowedCourseConfig.allowed = false;
          $t.isAllowedCourseConfig.message = error.error.message;
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
        if(error.status == 403){
          $t.isAllowedJobConfig.allowed = false;
          $t.isAllowedJobConfig.message = error.error.message;
        }
        $t.recommendedJobs.isFetching = false;
      }
    );
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getPosts();
    this.getCourses();
    this.getRecommendedCourses();
    this.getRecommendedJobs();
    this.getJobsApplications();
    this.user.type == 'Recruiter' ? this.getJobsForOrganization() : '';
  }
}
