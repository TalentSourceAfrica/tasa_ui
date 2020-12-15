import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '@app/services/shared.service';
import { CredentialsService, AuthenticationService } from '@app/auth';

@Component({
  selector: 'app-job-view',
  templateUrl: './job-view.component.html',
  styleUrls: ['./job-view.component.scss'],
})
export class JobViewComponent implements OnInit {
  @ViewChild('uploadResume', { static: false }) public upResume: any;
  uds: any;
  resumeLink: string = '';
  jobConfig: any = {
    jobId: '',
    job: undefined,
    fetchingJob: true,
  };
  applied: boolean = false;
  isAdmin: boolean = false;
  isRecruiter: boolean = false;

  constructor(
    private sharedService: SharedService,
    public route: ActivatedRoute,
    public router: Router,
    public credentialsService: CredentialsService,
    public authenticationService: AuthenticationService
  ) {
    this.jobConfig.jobId = this.route.snapshot.params.jobId;
    this.uds = this.sharedService.plugins.undSco;
    this.user && this.user.type.toLowerCase() === 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
    this.user && this.user.type.toLowerCase() === 'recruiter' ? (this.isRecruiter = true) : (this.isRecruiter = false);
  }

  changeJobStatus(_job: any, _statusToSet: string) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Updating Status...');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('publishJob', {
      '{jobId}': _job.id,
      '{status}': _statusToSet,
    });
    _job.status = _statusToSet;
    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Status Updated..!');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
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

        if ($t.user) {
          $t.user['recentlyViewedJobs'].push({
            description: response.responseObj.description,
            experienceFrom: response.responseObj.experienceFrom,
            experienceTo: response.responseObj.experienceTo,
            id: response.responseObj.id,
            location: response.responseObj.location,
            tags: response.responseObj.tags,
            title: response.responseObj.title,
          });
          $t.user['recentlyViewedJobs'] = $t.uds.uniq($t.user['recentlyViewedJobs'], (d: any) => {
            return d.id;
          });
          $t.authenticationService.login(this.user);
        }

        $t.jobConfig.job.applicants.forEach((candidate: any) => {
          if (candidate.userId === $t.user.email) {
            $t.applied = true;
            // if (candidate.status === 'Applied') {
            //   $t.applied = true;
            // } else {
            //   $t.applied = false;
            // }
            $t.jobConfig.job['applicantStatus'] = candidate.status;
          }
        });
      },
      (error) => {
        $t.jobConfig.fetchingJob = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        setTimeout(() => {
          $t.sharedService.uiService.closePopMsg();
          if ($t.user.type === 'Recruiter') {
            $t.router.navigate(['/recruiter/jobs'], { replaceUrl: true });
          } else {
            $t.router.navigate(['/jobs/listings'], { replaceUrl: true });
          }
        }, 2000);
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
        $t.resumeLink = response.url;
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
        $t.jobConfig.job.applicantStatus = 'Applied';
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }
  
  getFormatDate(_date:any){
    return this.sharedService.plugins.mom(_date).format('DD/MM/YYYY');
  }

  ngOnInit(): void {
    this.getJobDetail();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
