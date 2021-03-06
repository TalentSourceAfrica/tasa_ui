import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { applicantJobStatus } from '@app/models/constants';
import { SharedService } from '@app/services/shared.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-show-applicants',
  templateUrl: './show-applicants.component.html',
  styleUrls: ['./show-applicants.component.scss'],
})
export class ShowApplicantsComponent implements OnInit {
  uds: any;
  doc: any = '';
  popupData: any;
  applicantJobStatus = applicantJobStatus;
  bulkStatus = '';
  isLoading: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ShowApplicantsComponent>,
    public sharedService: SharedService,
    public sanitizer: DomSanitizer
  ) {
    this.uds = this.sharedService.plugins.undSco;
    this.popupData = JSON.parse(JSON.stringify(data));
  }

  selDeAll(_type: string) {
    switch (_type) {
      case 'select':
        this.uds.each(this.popupData.job.applicants, (d: any) => {
          if (d.status != 'Withdrawn') {
            d['isSelected'] = true;
          }
        });

        if (this.popupData.job.applicants.filter((d: any) => d.isSelected).length) {
          this.sharedService.uiService.showMessage('Applicants Are Selected');
        } else {
          this.sharedService.uiService.showMessage('Applicants Cannot be Selected');
        }

        break;
      case 'deselect':
        this.uds.each(this.popupData.job.applicants, (d: any) => {
          d['isSelected'] = false;
        });
        this.sharedService.uiService.showMessage('Applicants Are Deselected');
        break;
    }
  }

  showResume(user: any) {
    this.doc = user.resumeLink;
  }

  checkDisable() {
    return this.popupData.job.applicants.length
      ? this.popupData.job.applicants.filter((d: any) => d.isSelected).length == 0
      : true;
  }

  selectApplicant(event: any, applicant: any) {
    event.stopPropagation();
    event.preventDefault();
    applicant['isSelected'] = applicant['isSelected'] ? !applicant['isSelected'] : true;
  }

  afterStatusChange(_status: string) {
    this.bulkStatus = _status;
  }

  editApplicantJob(_bulk?: boolean) {
    const job = this.popupData.job;
    let $t = this;
    if (_bulk) {
      this.uds.each(this.popupData.job.applicants, (d: any) => {
        d['status'] = this.bulkStatus;
      });
    }
    $t.sharedService.uiService.showApiStartPopMsg('Updating Applicants Status...');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('updateJob', { '{jobId}': '234' });
    $t.sharedService.configService.put(apiUrl, job).subscribe(
      (response: any) => {
        $t.dialogRef.afterClosed().subscribe((result) => {
          $t.sharedService.utilityService.changeMessage('TRIGGER-RECRUITER-JOBS');
        });
        $t.sharedService.uiService.showApiSuccessPopMsg('Applicants Status updated...');
        if (_bulk) {
          $t.dialogRef.close();
        }
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  filterBasedOnStatus() {
    switch (this.popupData.applicantStatus) {
      case 'All':
        break;
      case 'Applied':
        this.popupData.job.applicants = this.popupData.job.applicants.filter(
          (d: any) => d.status != 'Accepted' && d.status != 'Rejected'
        );
        break;
      case 'Accepted':
        this.popupData.job.applicants = this.popupData.job.applicants.filter((d: any) => d.status === 'Accepted');
        break;
      case 'Under Review':
        this.popupData.job.applicants = this.popupData.job.applicants.filter((d: any) => d.status === 'Under Review');
        break;
      case 'Rejected':
        this.popupData.job.applicants = this.popupData.job.applicants.filter((d: any) => d.status === 'Rejected');
        break;
      case 'Withdrawn':
        this.popupData.job.applicants = this.popupData.job.applicants.filter((d: any) => d.status === 'Withdrawn');
        break;
    }
    this.isLoading = false;
  }

  fetchJobDetails(_callback: any) {
    let $t = this;
    let api = $t.sharedService.urlService.apiCallWithParams('getJob', {
      '{jobId}': $t.popupData.job[$t.popupData.fromWhere == 'rec-dashboard' ? 'jobId' : 'id']
     });
    $t.sharedService.configService.get(api).subscribe(
      (response: any) => {
        $t.popupData.job = JSON.parse(JSON.stringify(response.responseObj));
        _callback();
      },
      error => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.message);
      }
    );  
  }

  ngOnInit(): void { 
    let callBack = () => {
      this.filterBasedOnStatus();
    };
    this.fetchJobDetails(callBack);
  }
}
