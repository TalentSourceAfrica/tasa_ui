import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ShowApplicantsComponent } from '@app/partials/popups/recruiter/show-applicants/show-applicants.component';
import * as Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);

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
  selectedJobId:any;
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
    isFetching: false,
    resultsLength: 0,
  };
  matTabData: any = [];

  isAllowedCourseConfig: any = { allowed: true, message: '' }; // when user exceed the subscription plan
  isAllowedJobConfig: any = { allowed: true, message: '' }; // when user exceed the subscription plan
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: any = {
    chart: {
      type: 'column',
    },
    colors: [
      '#2f7ed8',
      '#0d233a',
      '#8bbc21',
      '#910000',
      '#1aadce',
      '#492970',
      '#f28f43',
      '#77a1e5',
      '#c42525',
      '#a6c96a',
    ],
    title: {
      text: 'All Job Posting',
    },
    subtitle: {
      text: '',
    },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      title: {
        text: 'Total percent student applied',
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y:.1f}%',
        },
        events: {
          click: (data: any) => {
            data.point.drilldown ? this.selectedJobId = data.point.jobId : null;
            if (data && data.point && !data.point.drilldown) {
              // const jobId = data.point.jobId;
              const job = this.matTableConfig.data.find((d: any) => d.jobId === this.selectedJobId);
              this.showApplicants(job, data, data.point.name);
            }
          },
        },
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
    },
    series: [
      {
        name: 'All Job Posting',
        colorByPoint: true,
        data: [],
      },
    ],
    drilldown: {
      series: [],
    },
  };
  constructor(
    public sharedService: SharedService,
    private router: Router,
    private credentialsService: CredentialsService
  ) {
    this.user.type.toLowerCase() == 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
    this.uds = this.sharedService.plugins.undSco;
  }

  showApplicants(job: any, event: any, applicantStatus: string) {
    // event.stopPropagation();
    // event.preventDefault();
    this.sharedService.dialogService.open(ShowApplicantsComponent, {
      width: '80%',
      data: {
        job: job,
        user: this.user,
        applicantStatus: applicantStatus,
        fromWhere: 'rec-dashboard',
      },
      disableClose: false,
    });
  }

  getJobsForOrganization() {
    let $t = this;
    let api = $t.sharedService.urlService.apiCallWithParams('getJobsByOrg', {
      '{orgId}': $t.user.orgId,
    });
    $t.matTableConfig.isFetching = true;
    $t.sharedService.configService.get(api).subscribe(
      (response: any) => {
        $t.matTableConfig.data = response.responseObj;
        $t.matTableConfig.resultsLength = $t.matTableConfig.data.length;
        $t.createChartData();
        $t.matTableConfig.isFetching = false;
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error);
        $t.matTableConfig.isFetching = false;
      }
    );
  }

  createChartData() {
    let $t = this;
    let totalApplicantOfAllJobs = 0;

    $t.matTableConfig.data.forEach((element: any) => {
      totalApplicantOfAllJobs += element.applicants.length;
    });
    $t.matTableConfig.data.forEach((element: any, index: any) => {
      $t.chartOptions.series[0].data.push({
        name: element.title,
        y: (element.applicants.length / totalApplicantOfAllJobs) * 100,
        jobId: element.jobId,
        drilldown: element.jobId,
      });

      $t.chartOptions.drilldown.series.push({
        name: element.title,
        id: element.jobId,
        data: [],
      });
      $t.chartOptions.drilldown.series[index].data.push(
        {
          name: 'Applied',
          y: element.applicationReceivedCount,
        },
        {
          name: 'Accepted',
          y: element.applicationAcceptedCount,
        },
        {
          name: 'Rejected',
          y: element.applicationRejectedCount,
        }
      );
      // {name:'abc',y:80},
      // {name:'kjhjkjh',y:20}
    });
    console.log($t.chartOptions);
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
        if (error.status == 403) {
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
        if (error.status == 403) {
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
