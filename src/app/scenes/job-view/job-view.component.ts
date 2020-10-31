import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/services/shared.service';

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

  constructor(private sharedService: SharedService, public route: ActivatedRoute) {
    this.jobConfig.jobId = this.route.snapshot.params.jobId;
  }

  getJobDetail() {
    let $t = this;
    $t.jobConfig.fetchingJob = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getJob', {
      '{jobId}': $t.jobConfig.jobId,
    });
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
}
