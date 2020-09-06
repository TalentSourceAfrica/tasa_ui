import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

//service
import { SharedService } from '@app/services/shared.service';
import { MustMatch } from '@app/auth/must-match';

@Component({
  selector: 'app-signup-popup',
  templateUrl: './signup-popup.component.html',
  styleUrls: ['./signup-popup.component.scss'],
})
export class SignupPopupComponent implements OnInit {
  signupForm: FormGroup;
  popupData: any;
  signupType: any = [
    { value: 0, viewValue: 'Mentee' },
    { value: 1, viewValue: 'Mentor' },
    { value: 2, viewValue: 'Recruiter' },
  ];
  userType = { value: 0, viewValue: 'Mentee' };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SignupPopupComponent>,
    private sharedService: SharedService
  ) {
    this.popupData = data;
    this.initForm(false);
  }

  signupTypeChange() {
    this.userType.value == 0 || this.userType.value == 1 ? this.initForm(false) : this.initForm(true);
  }

  initForm(_isRecruiter: boolean) {
    if (!_isRecruiter) {
      this.signupForm = this.formBuilder.group(
        {
          firstName: ['', [Validators.required]],
          lastName: ['', [Validators.required]],
          username: ['', [Validators.required]],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required]],
          confirmPassword: ['', [Validators.required]],
          termsCond: [true, [Validators.required]],
        },
        {
          validator: MustMatch('password', 'confirmPassword'),
        }
      );
    } else {
      this.signupForm = this.formBuilder.group(
        {
          organizationName: ['', [Validators.required]],
          username: ['', [Validators.required]],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required]],
          confirmPassword: ['', [Validators.required]],
          termsCond: [true, [Validators.required]],
        },
        {
          validator: MustMatch('password', 'confirmPassword'),
        }
      );
    }
  }

  login() {
    this.dialogRef.close();
    this.popupData.authenticationService.openLoginPopup();
    // this.sharedService.dialogService.open(LoginComponent, { width: '600px', data: {}, disableClose: false });
  }

  onSubmit() {
    console.log(this.signupForm.value);
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('signup');
    $t.sharedService.uiService.showApiStartPopMsg('Creating Account...');
    let payload = { ...$t.signupForm.value, type: $t.userType.viewValue };
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response) => {
        console.log(response);
        $t.sharedService.uiService.showApiSuccessPopMsg('Email has been send. Please do the verification...!');
      },
      (error: any) => {
        console.log(error);
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {}
}
