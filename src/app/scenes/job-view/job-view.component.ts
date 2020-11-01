import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/services/shared.service';
import { CredentialsService } from '@app/auth';

@Component({
  selector: 'app-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.scss'],
})
export class JobViewComponent implements OnInit {
  @ViewChild('uploadResume', { static: false }) public upResume: any;
  resumeLink: string = '';
  jobConfig: any = {
    jobId: '',
    job: undefined,
    fetchingJob: true,
  };
  applied: boolean = false;

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
        response.responseObj.applicants.forEach((candidate: any) => {
          if (candidate.userId == $t.user.email) {
            if (candidate.status == 'Applied') {
              $t.applied = true;
            } else {
              $t.applied = false;
            }
          }
        });
      },
      (error) => {
        $t.jobConfig.fetchingJob = false;
      }
    );
  }

  triggerUpload() {
    this.upResume.nativeElement.click();
  }

  uploadFile(_event: any) {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadSingle', { '{email}': $t.user.email });
    let files = _event.target.files;
    var form = new FormData();
    form.append('file', files[0], files[0].name);
    $t.sharedService.uiService.showApiStartPopMsg('Uploading Resume...');
    $t.sharedService.configService.post(apiUrl, form).subscribe(
      (response: any) => {
        $t.resumeLink = response.data;
        $t.sharedService.uiService.showApiSuccessPopMsg('Resume Uploaded...');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
      }
    );
  }

  applyForJob() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('applyJob', {
      '{jobId}': $t.jobConfig.job.id,
    });
    let payload = {
      name: $t.user.firstName + ' ' + $t.user.lastName,
      resumeLink: $t.resumeLink,
      appliedOn: '',
      status: 'Applied',
      userId: $t.user.email,
      referrer: '',
      referred: false,
    };
    $t.sharedService.uiService.showApiStartPopMsg('Applying For ' + $t.jobConfig.job.title + '...');
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Applied Successfully...');
        $t.applied = true;
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error);
      }
    );
  }

  ngOnInit(): void {
    this.getJobDetail();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
