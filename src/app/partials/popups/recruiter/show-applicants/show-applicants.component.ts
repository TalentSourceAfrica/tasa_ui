import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { applicantJobStatus } from '@app/models/constants';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-show-applicants',
  templateUrl: './show-applicants.component.html',
  styleUrls: ['./show-applicants.component.scss'],
})
export class ShowApplicantsComponent implements OnInit {
  popupData: any;
  applicantJobStatus = applicantJobStatus;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ShowApplicantsComponent>,
    public sharedService: SharedService
  ) {
    this.popupData = JSON.parse(JSON.stringify(data));
  }

  editApplicantJob() {
    const job = this.popupData.job;
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Updating Applicants Status...');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('updateJob', { '{jobId}': job.id });
    $t.sharedService.configService.put(apiUrl, job).subscribe(
      (response: any) => {
        $t.dialogRef.afterClosed().subscribe((result) => {
          $t.sharedService.utilityService.changeMessage('TRIGGER-RECRUITER-JOBS');
        });
        $t.sharedService.uiService.showApiSuccessPopMsg('Applicants Status updated...');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {}
}
