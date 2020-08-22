import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

//service
import { SharedService } from '@app/services/shared.service';

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

    let apiUrl = this.sharedService.urlService.simpleApiCall('getUsers');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  signupTypeChange() {
    this.userType.value == 0 || this.userType.value == 1 ? this.initForm(false) : this.initForm(true);
  }

  initForm(_isRecruiter: boolean) {
    if (!_isRecruiter) {
      this.signupForm = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        termsCond: [true, [Validators.required]],
      });
    } else {
      this.signupForm = this.formBuilder.group({
        organizationName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        termsCond: [true, [Validators.required]],
      });
    }
  }

  login() {
    this.dialogRef.close();
    this.popupData.authenticationService.openLoginPopup();
    // this.sharedService.dialogService.open(LoginComponent, { width: '600px', data: {}, disableClose: false });
  }

  onSubmit() {
    console.log(this.signupForm.value);
  }

  ngOnInit(): void {}
}
