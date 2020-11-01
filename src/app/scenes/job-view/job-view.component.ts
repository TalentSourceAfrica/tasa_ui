import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/services/shared.service';
import { CredentialsService } from '@app/auth';

@Component({
  selector: 'app-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.scss'],
})
export class JobViewComponent implements OnInit {
  jobConfig: any = {
    jobId: '',
    job: undefined,
    fetchingJob: true,
  };

  constructor(
    private sharedService: SharedService,
    public route: ActivatedRoute,
    public credentialsService: CredentialsService
  ) {
    this.jobConfig.jobId = this.route.snapshot.params.jobId;
  }

  getJobDetail() {
    let $t = this;
    $t.jobConfig.fetchingJob = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getJob', {
      '{jobId}': $t.jobConfig.jobId,
    });
    if ($t.user) {
      apiUrl = $t.sharedService.urlService.addQueryStringParm(apiUrl, 'user', $t.user.email);
    }
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.jobConfig.job = response.responseObj;
        $t.jobConfig.fetchingJob = false;
      },
      (error) => {
        $t.jobConfig.fetchingJob = false;
      }
    );
  }

  applyForJob() {
    // this.sharedService.dialogService.open(JobsApplyPopupComponent, {
    //   width: '50%',
    //   data: {
    //     applyingForJob: _course,
    //     user: this.user,
    //     waitTillSubmit: true,
    //   },
    // });
  }

  ngOnInit(): void {
    this.getJobDetail();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
