import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

//service
import { SharedService } from '@app/services/shared.service';
import { CredentialsService } from '@app/auth';

@Component({
  selector: 'app-user-details-popup',
  templateUrl: './user-details-popup.component.html',
  styleUrls: ['./user-details-popup.component.scss'],
})
export class UserDetailsPopupComponent implements OnInit {
  userDetailsForm: FormGroup;
  popupData: any;
  userDetails: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UserDetailsPopupComponent>,
    private sharedService: SharedService,
    private credentialsService: CredentialsService
  ) {
    this.userDetails = this.user;
  }

  initForm() {
    this.userDetailsForm = this.formBuilder.group({
      addressLine1: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      highestDegree: ['', [Validators.required]],
      college: ['', [Validators.required]],
      university: ['', [Validators.required]],
      major: ['', [Validators.required]],
      certificate: [''],
      experience: [''],
      organization: [''],
      currentRole: [''],
      areaOfPreference: ['', [Validators.required]],
      preferredRole: ['', [Validators.required]],
      careerGoals: ['', [Validators.required]],
    });
  }

  onSubmit() {
    console.log(this.userDetailsForm.value);
    let $t = this;

    let apiUrl = $t.sharedService.urlService.simpleApiCall('getUsers');
    const user = $t.userDetailsForm.value;
    $t.userDetails.address1 = user.addressLine1;
    $t.userDetails.country = user.country;
    $t.userDetails.state = user.state;
    $t.userDetails.city = user.city;
    $t.userDetails.postalCode = user.postalCode;

    $t.userDetails.highestDegree = user.highestDegree;
    $t.userDetails.college = user.college;
    $t.userDetails.university = user.university;
    $t.userDetails.major = user.major;
    $t.userDetails.certificates = user.certificates;

    $t.userDetails.areaOfPreference = user.areaOfPreference;
    $t.userDetails.preferredRole = user.preferredRole;
    $t.userDetails.organization = user.organization;
    $t.userDetails.major = user.major;
    $t.userDetails.careerGoals = user.careerGoals;

    $t.sharedService.configService.put(apiUrl, $t.userDetails).subscribe(
      (response) => {
        $t.popupData.authenticationService.login(response);
        $t.sharedService.uiService.showApiSuccessPopMsg('Details Added Successfully');
        $t.dialogRef.close();
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    this.initForm();
  }
}
