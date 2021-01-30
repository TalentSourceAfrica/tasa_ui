import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// service
import { SharedService } from '@app/services/shared.service';
import { CredentialsService } from '@app/auth/credentials.service';
import { MustMatch } from '@app/auth/must-match';

@Component({
  selector: 'app-signup-popup',
  templateUrl: './signup-popup.component.html',
  styleUrls: ['./signup-popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignupPopupComponent implements OnInit {
  signupForm: FormGroup;
  doc = '';
  userDetailsForm: FormGroup;
  countries: any;

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
    private sharedService: SharedService,
    private credentialsService: CredentialsService

  ) {
    this.popupData = data;
    this.initForm();
  }

  initForm() {
    if (this.popupData.case == 'student') {
        this.userDetailsForm = this.formBuilder.group({
          firstName: ['', [Validators.required]],
          lastName: ['', [Validators.required]],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required]],
          confirmPassword: ['', [Validators.required]],
          termsCond: [true, [Validators.required]],
          country: ['', [Validators.required]],
          state: ['', [Validators.required]],
          city: ['', [Validators.required]],
          postalCode: ['', [Validators.required]],

          highestDegree: ['', [Validators.required]],
          college: ['', [Validators.required]],
          university: ['', [Validators.required]],
          major: ['', [Validators.required]],
          minor: [''],
          degreeFromDate: [''],
          degreeToDate: [''],
          // certificate: [''],
          organization: [''],
          currentRole: [''],
          description: [''],
          experienceFrom: [''],
          experienceTo: [''],

          areaOfPreference: ['', [Validators.required]],
          preferredRole: ['', [Validators.required]],
          careerGoals: ['', [Validators.required]],
        }, {
          validator: MustMatch('password', 'confirmPassword')
        });
    } else {
      this.userDetailsForm = this.formBuilder.group({
          firstName: ['', [Validators.required]],
          lastName: ['', [Validators.required]],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required]],
          confirmPassword: ['', [Validators.required]],
          termsCond: [true, [Validators.required]],
          country: ['', [Validators.required]],
          organizationName: ['', [Validators.required]],
          state: ['', [Validators.required]],
          city: ['', [Validators.required]],
          postalCode: ['', [Validators.required]],
          location: ['', [Validators.required]],
          description: ['', [Validators.required]],
          about: ['', [Validators.required]],
          noEmp: ['', [Validators.required]],
          industry: ['', [Validators.required]],
          contactNo: ['', [Validators.required]],
          contactEmail: ['', [Validators.required]],
          website: ['', [Validators.required]],
          linkedin: ['', [Validators.required]],
          twitter: ['', [Validators.required]],
          areaOfPreference: ['', [Validators.required]],
          preferredRole: ['', [Validators.required]],
          careerGoals: ['', [Validators.required]],
      }, {
         validator: MustMatch('password', 'confirmPassword')
      });
    }
  }

  initFAs(_case: string) {
    const newFA = new FormArray([]);
    if (this.user[_case] != null && this.user[_case].length != 0) {
        this.user[_case].forEach((d: any) => {
          newFA.push(this.formBuilder.group({ name: [d, [Validators.required]]}));
        });
    } else {
      newFA.push(this.formBuilder.group({ name: ['', [Validators.required]] }));
    }
    return newFA;
  }

  onSubmit() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('signup');
    $t.sharedService.uiService.showApiStartPopMsg('Creating Account...');
    let payload = { ...JSON.parse(JSON.stringify($t.userDetailsForm.value)), type: $t.userType.dbValue };
    let areaOfPreference: any = [], preferredRole: any = [];
    payload['experience'] = [];
    payload.experience.push({ 
      experience: [],
      currentRole: [],
      description: [],
      organization: JSON.parse(JSON.stringify(payload.organization)),
      experienceTo: JSON.parse(JSON.stringify(payload.experienceTo)),
      experienceFrom: JSON.parse(JSON.stringify(payload.experienceFrom))
    });
    payload['education'] = [];
    payload.education.push({
        highestDegree: JSON.parse(JSON.stringify(payload.highestDegree)),
        college: [],
        university: [],
        major: JSON.parse(JSON.stringify(payload.major)),
        minor: [],
        degreeFromDate: JSON.parse(JSON.stringify(payload.degreeFromDate)),
        degreeToDate: JSON.parse(JSON.stringify(payload.degreeFromDate))
    });
    payload.postalCode = parseInt(payload.postalCode);
    areaOfPreference.push(JSON.parse(JSON.stringify(payload.areaOfPreference)));
    preferredRole.push(JSON.parse(JSON.stringify(payload.preferredRole)));
    payload.areaOfPreference = JSON.parse(JSON.stringify(areaOfPreference));
    payload.preferredRole = JSON.parse(JSON.stringify(preferredRole));
    payload.experience[0].currentRole.push(JSON.parse(JSON.stringify(payload.currentRole)));
    payload.experience[0].description.push(JSON.parse(JSON.stringify(payload.description)));
    payload.education[0].college.push(JSON.parse(JSON.stringify(payload.college)));
    payload.education[0].university.push(JSON.parse(JSON.stringify(payload.university)));
    payload.education[0].minor.push(JSON.parse(JSON.stringify(payload.minor)));
    delete payload['currentRole']; 
    delete payload['description'];
    delete payload['organization'];
    delete payload['experienceTo'];
    delete payload['experienceFrom'];
    delete payload['highestDegree'];
    delete payload['college'];
    delete payload['university'];
    delete payload['major'];
    delete payload['minor'];
    delete payload['degreeFromDate'];
    delete payload['degreeToDate'];
    $t.sharedService.configService.put(apiUrl, payload).subscribe(
      (response: any) => {
        $t.userDetailsForm.reset();
        if ($t.userType.dbValue !== 'Recruiter') {
          $t.sharedService.uiService.showApiSuccessPopMsg('Please check inbox for successful verification...!');
        } else {
          $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
        }
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

  getCountry() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getCountry');

    $t.sharedService.configService.get(apiUrl).subscribe((response) => {
      $t.countries = response;
    });
  }

  // signupTypeChange() {
  //   this.userType.value == 0 || this.userType.value == 1 ? this.initForm(false) : this.initForm(true);
  // }

  // initForm(_isRecruiter: boolean) {
  //   if (!_isRecruiter) {
  //     this.signupForm = this.formBuilder.group(
  //       {
  //         firstName: ['', [Validators.required]],
  //         lastName: ['', [Validators.required]],
  //         username: ['', [Validators.required, Validators.pattern(this.unamePattern)]],
  //         email: ['', [Validators.required, Validators.email]],
  //         password: ['', [Validators.required]],
  //         confirmPassword: ['', [Validators.required]],
  //         termsCond: [true, [Validators.required]],
  //       },
  //       {
  //         validator: MustMatch('password', 'confirmPassword'),
  //       }
  //     );
  //   } else {
  //     this.signupForm = this.formBuilder.group(
  //       {
  //         firstName: ['', [Validators.required]],
  //         lastName: ['', [Validators.required]],
  //         organizationName: ['', [Validators.required]],
  //         username: ['', [Validators.required, Validators.pattern(this.unamePattern)]],
  //         email: ['', [Validators.required, Validators.email]],
  //         password: ['', [Validators.required]],
  //         confirmPassword: ['', [Validators.required]],
  //         termsCond: [true, [Validators.required]],
  //       },
  //       {
  //         validator: MustMatch('password', 'confirmPassword'),
  //       }
  //     );
  //   }
  // }

  // checkUsername() {
  //   let $t = this;
  //   let apiUrl = $t.sharedService.urlService.apiCallWithParams('checkUsername', {
  //     '{userName}': $t.signupForm.value.username,
  //   });

  //   $t.sharedService.configService.post(apiUrl).subscribe(
  //     (response: any) => {
  //       response.data == 'Y' ? ($t.isUsernameAvailable = true) : ($t.isUsernameAvailable = false);
  //     },
  //     (error) => {}
  //   );
  // }

  checkEmail() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('checkEmail', {
      '{email}': $t.userDetailsForm.value.email,
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
    this.getCountry();
  }
}
