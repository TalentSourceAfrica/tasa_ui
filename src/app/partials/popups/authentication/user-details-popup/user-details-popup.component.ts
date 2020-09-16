import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

//service
import { SharedService } from '@app/services/shared.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    this.popupData = data;
    this.userDetails = this.user;
  }

  initForm(_type: string) {
    switch (_type) {
      case 'Mentor':
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
          project: [''],
          areaOfPreference: ['', [Validators.required]],
          preferredRole: ['', [Validators.required]],
          careerGoals: ['', [Validators.required]],
          teachingExperience: ['', [Validators.required]],
          universityTought: [''],
          collegeTought: [''],
          specialization: [''],
          licenseNo: [''],
        });
        break;
      case 'Recruiter':
        this.userDetailsForm = this.formBuilder.group({
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

          addressLine1: ['', [Validators.required]],
          country: ['', [Validators.required]],
          state: ['', [Validators.required]],
          city: ['', [Validators.required]],
          postalCode: ['', [Validators.required]],
        });
        break;
      default:
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
          project: [''],
          areaOfPreference: ['', [Validators.required]],
          preferredRole: ['', [Validators.required]],
          careerGoals: ['', [Validators.required]],
        });
    }
  }

  onSubmit() {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Adding Details...');
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

    $t.userDetails.project1 = user.project;
    $t.userDetails.teachingExperience = user.teachingExperience;
    $t.userDetails.univTaught = user.universityTought;
    $t.userDetails.collegeTaught = user.collegeTaught;
    $t.userDetails.licenseNo = user.licenseNo;
    $t.userDetails.areaOfPreference = user.areaOfPreference;
    $t.userDetails.preferredRole = user.preferredRole;
    $t.userDetails.organization = user.organization;
    $t.userDetails.major = user.major;
    $t.userDetails.careerGoals = user.careerGoals;

    $t.userDetails.location = user.location;
    $t.userDetails.description = user.description;
    $t.userDetails.about = user.about;
    $t.userDetails.industry = user.industry;
    $t.userDetails.noOfEmployee = user.noEmp;

    $t.userDetails.twitter = user.twitter;
    $t.userDetails.linkedIn = user.linkedin;
    $t.userDetails.contactEmail = user.contactEmail;
    $t.userDetails.contactNo = user.contactNo;
    $t.userDetails.website = user.website;

    $t.sharedService.configService.put(apiUrl, $t.userDetails).subscribe(
      (response) => {
        $t.popupData.authenticationService.login(response);
        $t.sharedService.uiService.showApiSuccessPopMsg('Details Added Successfully');
        $t.dialogRef.close();
        $t.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  get user(): any | null {
    const credentials = this.popupData.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    this.initForm(this.user.type);
  }
}
