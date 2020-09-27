import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

//service
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-forgot-password-popup',
  templateUrl: './forgot-password-popup.component.html',
  styleUrls: ['./forgot-password-popup.component.scss'],
})
export class ForgotPasswordPopupComponent implements OnInit {
  forgortPassForm: FormGroup;
  popupData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ForgotPasswordPopupComponent>,
    private sharedService: SharedService
  ) {
    this.popupData = data;
    this.initForm();
  }

  login() {
    this.dialogRef.close();
    this.popupData.authenticationService.openLoginPopup();
  }

  initForm() {
    this.forgortPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    console.log(this.forgortPassForm.value);
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Sending Instructions...');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('forgotPassword', {
      '{email}': $t.forgortPassForm.value.email,
    });
    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        console.log(response);
        $t.forgortPassForm.reset();
        $t.dialogRef.close();
        $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {}
}
