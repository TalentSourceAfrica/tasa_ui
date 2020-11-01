import { Inject, Component, ViewChild, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-jobs-apply-popup',
  templateUrl: './jobs-apply-popup.component.html',
  styleUrls: ['./jobs-apply-popup.component.scss'],
})
export class JobsApplyPopupComponent implements OnInit {
  @ViewChild('uploadResume', { static: false }) public upResume: any;
  popupData: any;
  resumeLink: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<JobsApplyPopupComponent>,
    public sharedService: SharedService
  ) {
    this.popupData = data;
  }

  triggerUpload() {
    this.upResume.nativeElement.click();
  }

  uploadFile(_event: any) {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadSingle', { '{email}': $t.popupData.user.email });
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
      '{jobId}': $t.popupData.applyingForJob.id,
    });
    let payload = {
      name: $t.popupData.user.firstName + ' ' + $t.popupData.user.lastName,
      resumeLink: $t.resumeLink,
      appliedOn: '',
      status: 'Applied',
      userId: $t.popupData.user.email,
      referrer: '',
      referred: false,
    };
    $t.sharedService.uiService.showApiStartPopMsg('Applying For ' + $t.popupData.applyingForJob.title + '...');
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Applied Successfully...');
        $t.dialogRef.close();
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error);
      }
    );
  }

  ngOnInit(): void {}
}
