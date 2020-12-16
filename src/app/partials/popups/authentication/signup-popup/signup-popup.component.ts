import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// service
import { SharedService } from '@app/services/shared.service';
import { MustMatch } from '@app/auth/must-match';

@Component({
  selector: 'app-signup-popup',
  templateUrl: './signup-popup.component.html',
  styleUrls: ['./signup-popup.component.scss'],
})
export class SignupPopupComponent implements OnInit {
  signupForm: FormGroup;
  doc = '';
  organisationList: any = [];
  termsAndCondition = 'https://www.fleetster.net/legal/standard-terms-and-conditions.pdf';
  popupData: any;
  signupType: any = [
    { value: 0, dbValue: 'Mentee', viewValue: 'Student / Professional' },
    { value: 1, dbValue: 'Mentor', viewValue: 'Mentor' },
    { value: 2, dbValue: 'Recruiter', viewValue: 'Recruiter' },
  ];
  userType = { value: 0, dbValue: 'Mentee', viewValue: 'Student / Professional' };
  isUsernameAvailable = true;
  isEmailAvailable = true;
  unamePattern = '^[a-zA-Z0-9_.-]*$';
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
          username: ['', [Validators.required, Validators.pattern(this.unamePattern)]],
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
          firstName: ['', [Validators.required]],
          lastName: ['', [Validators.required]],
          organizationName: ['', [Validators.required]],
          username: ['', [Validators.required, Validators.pattern(this.unamePattern)]],
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

  checkUsername() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('checkUsername', {
      '{userName}': $t.signupForm.value.username,
    });

    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        response.data == 'Y' ? ($t.isUsernameAvailable = true) : ($t.isUsernameAvailable = false);
      },
      (error) => {}
    );
  }

  checkEmail() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('checkEmail', {
      '{email}': $t.signupForm.value.email,
    });

    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        response.data == 'Y' ? ($t.isEmailAvailable = true) : ($t.isEmailAvailable = false);
      },
      (error) => {}
    );
  }

  login() {
    this.dialogRef.close();
    this.popupData.authenticationService.openLoginPopup();
    // this.sharedService.dialogService.open(LoginComponent, { width: '600px', data: {}, disableClose: false });
  }

  onSubmit() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('signup');
    $t.sharedService.uiService.showApiStartPopMsg('Creating Account...');
    let payload = { ...$t.signupForm.value, type: $t.userType.dbValue };
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response: any) => {
        $t.dialogRef.close();
        if ($t.userType.dbValue !== 'Recruiter') {
          $t.sharedService.uiService.showApiSuccessPopMsg('Please check inbox for successful verification...!');
        } else {
          $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
        }
      },
      (error: any) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getOrganisation() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getActiveOrganization');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.organisationList = response.responseObj;
      },
      (error: any) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  openTerms() {
    this.doc = this.termsAndCondition;
  }

  createOrganization(){
    this.popupData.authenticationService.opneCreateOrganization();
  }

  ngOnInit(): void {
    this.getOrganisation();
  }
}
