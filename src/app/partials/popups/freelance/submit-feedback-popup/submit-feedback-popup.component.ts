import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-submit-feedback-popup',
  templateUrl: './submit-feedback-popup.component.html',
  styleUrls: ['./submit-feedback-popup.component.scss'],
})
export class SubmitFeedbackPopupComponent implements OnInit {
  popupData: any;
  feedback = {
    id: '',
    userId: '',
    tasaId: '',
    userImage: '',
    active: '',
    ratedBy: '',
    ratedByTasaId: '',
    ratedByUserImage: '',
    ratedForRequirementId: '',
    ratedForRequirementCategory: '',
    sincerity: 1,
    promptness: 1,
    proactiveness: 1,
    technical: 1,
    analytical: 1,
    problemSolving: 1,
    quality: 1,
    timelines: 1,
    satisfaction: 1,
    comments: '',
    createdOn: '',
    createdBy: '',
    updatedOn: '',
    updatedBy: '',
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SubmitFeedbackPopupComponent>,
    public sharedService: SharedService,
    public cdr: ChangeDetectorRef
  ) {
    this.popupData = data;
    console.log(this.popupData);
  }

  submit() {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Submiting Feedback.');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('rating', {
      '{userId}': $t.popupData.user.email,
      '{ratedBy}': $t.popupData.buyerDetails.email,
    });

    $t.feedback.userId = $t.popupData.user.email;
    $t.feedback.tasaId = $t.popupData.user.tasaId;
    $t.feedback.userImage = $t.popupData.user.userImage;
    $t.feedback.ratedBy = $t.popupData.buyerDetails.name;
    $t.feedback.ratedByTasaId = $t.popupData.buyerDetails.tasaId;
    $t.feedback.ratedByUserImage = $t.popupData.buyerDetails.userImage;
    $t.feedback.ratedForRequirementId = $t.popupData.reqDetails.requirementId;
    $t.feedback.ratedForRequirementCategory = $t.popupData.reqDetails.requirementCategory;;

    $t.sharedService.configService.post(apiUrl, $t.feedback).subscribe(
      (response: any) => {
        $t.dialogRef.close();
        $t.sharedService.uiService.showApiSuccessPopMsg('Thanks! Feedback given to freelancer.');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {}
}
