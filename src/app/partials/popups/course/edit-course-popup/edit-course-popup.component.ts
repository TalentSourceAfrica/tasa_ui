import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-edit-course-popup',
  templateUrl: './edit-course-popup.component.html',
  styleUrls: ['./edit-course-popup.component.scss'],
})
export class EditCoursePopupComponent implements OnInit {
  popupData: any;
  categoryList = ['abc', '123'];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditCoursePopupComponent>,
    private sharedService: SharedService
  ) {
    this.popupData = data;
    console.log(this.popupData);
  }

  onDiscountChange(event: any, course: any) {
    course.offerPrice = course.entitlements[0].price * ((100 - parseInt(event.target.value)) / 100);
  }

  submit() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('updateCourse', {
      '{userId}': this.popupData.user.email,
    });
    $t.sharedService.uiService.showApiStartPopMsg('Updating Course...');
    $t.sharedService.configService.post(apiUrl, this.popupData.courses).subscribe(
      (response) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Course Updated...!');
        $t.sharedService.utilityService.changeMessage('TRIGGER-COURSE-SEARCH');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {}
}
