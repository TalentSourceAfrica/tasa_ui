import { Component, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { filter, delay } from 'rxjs/operators';
import { jobsSearchData } from '@app/models/constants';
import { untilDestroyed } from '@app/@core';

// service
import { SharedService } from '@app/services/shared.service';
import { CredentialsService, AuthenticationService } from '@app/auth';

@Component({
  selector: 'app-my-job-applications',
  templateUrl: './my-job-applications.component.html',
  styleUrls: ['./my-job-applications.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MyJobApplicationsComponent implements OnInit {
  uds: any;
  isLoading: boolean = true;
  length = 100;
  pageSize = 20;
  isAdmin: boolean = false;
  jobApplications: any = [];
  panelOpenState: boolean;
  all: any = [];
  underReview: any = [];
  accepted: any = [];
  rejected: any = [];
  jobStatus: any = [
    ['All', 'all'],
    ['Under Review', 'underReview'],
    ['Accepted', 'accepted'],
    ['Rejected', 'rejected'],
  ];

  constructor(
    public sharedService: SharedService,
    public router: Router,
    public credentialsService: CredentialsService,
    public authenticationService: AuthenticationService
  ) {
    this.uds = this.sharedService.plugins.undSco;
    this.user && this.user.type.toLowerCase() == 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
  }

  init() {
    this.getJobsApplications();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  findWhereToDisplay(_data: any) {
    _data.forEach((data: any) => {
      data.applicants.filter((d: any) => {
        if (d.userId == this.user.email) {
          switch (d.status) {
            case 'Submitted':
              this.all.push(data);
              break;
            case 'Under Review':
              this.all.push(data);
              this.underReview.push(data);
              break;
            case 'Accepted':
              this.all.push(data);
              this.accepted.push(data);
              break;
            case 'Rejected':
              this.all.push(data);
              this.rejected.push(data);
              break;
          }
        }
      });
    });
  }

  checkStatus(_course: any) {
    let displayText: string = '';
    _course.applicants.forEach((d: any) => {
      if (d.userId == this.user.email) {
        switch (d.status) {
          case 'Submitted':
            displayText = 'Submitted';
            break;
          case 'Under Review':
            displayText = d.status;
            break;
          case 'Accepted':
            displayText = d.status;
            break;
          case 'Rejected':
            displayText = d.status;
            break;
        }
      }
    });
    return displayText;
  }

  getJobsApplications() {
    this.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getJobApplications', {
      '{userId}': this.user.email,
      '{page}': 0,
      '{size}': 0,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.jobApplications = response.responseObj;
        this.length = response.responseObj.length;
        this.isLoading = false;
        this.findWhereToDisplay(response.responseObj);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.sharedService.utilityService.requiredStyleForHomeHeader();
    window.scrollTo(0, 0);
    this.init();
  }

  ngOnDestroy(): void {}
}
