import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';

//service
import { SharedService } from '@app/services/shared.service';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
//extra

declare var jQuery: any;

@Component({
  selector: 'app-user-details-popup',
  templateUrl: './user-details-popup.component.html',
  styleUrls: ['./user-details-popup.component.scss'],
})
export class UserDetailsPopupComponent implements OnInit {
  @ViewChild('file', { static: false }) public file: any;
  userDetailsForm: FormGroup;
  popupData: any;
  userDetails: any;
  countries: any = [];
  industryData: any = [];
  highestDegreeData: any = [];
  steps: any = [
    {
      id: 0,
      isActive: true,
    },
    {
      id: 1,
      isActive: false,
    },
    {
      id: 2,
      isActive: false,
    },
    {
      id: 3,
      isActive: false,
    },
  ];
  universityConifg:any = {
    isLoading: false,
    data: []
  }
  //chips
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UserDetailsPopupComponent>,
    private sharedService: SharedService,
    private router: Router,
    public cdr: ChangeDetectorRef
  ) {
    this.popupData = data;
    this.userDetails = this.user;
  }

  stepsClick(_id: number, _isForward: boolean) {
    // setting Data for next screen
    if (_id === 1) {
      this.addExp();
    }
    if (_id === 2) {
      this.addEdu();
    }

    // steps logic
    if (_isForward) {
      this.steps.find((d: any) => d.id === _id).isActive = false;
      this.steps.find((d: any) => d.id === _id + 1).isActive = true;
    } else {
      this.steps.find((d: any) => d.id === _id).isActive = false;
      this.steps.find((d: any) => d.id === _id - 1).isActive = true;
    }
  }

  add(event: MatChipInputEvent, _type?: string): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      if (_type === 'minor') {
        this.user.education[0].minor.push(value.trim());
      } else {
        this.user.preferredRole.push(value.trim());
      }
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(skill: any, _type?: string): void {
    let index;
    if (_type === 'minor') {
      index = this.user.education[0].minor.indexOf(skill);
      this.user.education[0].minor.splice(index, 1);
    } else {
      index = this.user.preferredRole.indexOf(skill);
      this.user.preferredRole.splice(index, 1);
    }
  }

  addExp() {
    if (this.user.experience.length === 0) {
      this.user.experience.push({
        currentRole: [''],
        description: [''],
        experience: 'false',
        experienceFrom: '',
        experienceTo: '',
        organization: '',
        recentEmployer: '',
        industry: [],
        professionalInterest: [],
      });
    }
    this.cdr.detectChanges();
  }

  addEdu() {
    if (this.user.education.length === 0) {
      this.user.education.push({
        college: [],
        degreeFromDate: '',
        degreeToDate: '',
        highestDegree: '',
        major: '',
        minor: [],
        university: [],
      });
    }

    this.cdr.detectChanges();
  }

  removeExp(index: number) {
    this.user.experience.splice(index, 1);
  }

  removeEdu(index: number) {
    this.user.education.splice(index, 1);
  }

  handleFileInput(event: any) {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadUserImage', { '{email}': $t.user.email });
    apiUrl = $t.sharedService.urlService.addQueryStringParm(apiUrl, 'profile', true);
    let files = event.target.files;
    var form = new FormData();
    form.append('file', files[0], files[0].name);
    if ($t.sharedService.utilityService.ValidateImageUpload(files[0].name)) {
      $t.sharedService.uiService.showApiStartPopMsg('Updating User Avatar...');

      $t.sharedService.configService.post(apiUrl, form).subscribe(
        (response: any) => {
          $t.sharedService.uiService.showApiSuccessPopMsg('Awesome!, User Avatar Updated.');
          $t.user.image = response.url;
          $t.popupData.authenticationService.login($t.user);
          $t.sharedService.utilityService.changeMessage('FETCH-USER-PROFILE');
          $t.stepsClick(0, true);
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
        }
      );
    } else {
      $t.sharedService.uiService.showApiErrorPopMsg(
        'Uploaded File is not a Valid Image. Only JPG, PNG and JPEG files are allowed.'
      );
    }
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
          type: ['Mentee'],
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

  skip() {
    let _callback = () => {
      setTimeout(() => {
        this.dialogRef.close();
        this.router.navigate(['/social-network/posts'], { replaceUrl: true });
      }, 1000);
    };
    this.sharedService.uiService.showPreConfirmPopMsg(
      'This information will help us make job, network and course recommendations.',
      _callback
    );
  }

  callUpload(event: any) {
    event.stopPropagation();
    event.preventDefault();
    this.file.nativeElement.click();
  }

  onSubmit() {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Adding Details...');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getUsers');
    const user = $t.userDetailsForm.value;
    $t.userDetails.type = user.type;
    $t.userDetails.address1 = user.addressLine1;
    $t.userDetails.country = user.country;
    $t.userDetails.state = user.state;
    $t.userDetails.city = user.city;
    $t.userDetails.postalCode = user.postalCode;

    $t.userDetails.highestDegree = user.highestDegree;
    $t.userDetails.college = [user.college];
    $t.userDetails.university = [user.university];
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
      (response: any) => {
        $t.popupData.authenticationService.login(response.responseObj);
        $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
        $t.dialogRef.close();
        $t.router.navigate(['/dashboard'], { replaceUrl: true });
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  submit(_type: string) {
    let $t = this;
    const _user = JSON.parse(JSON.stringify($t.user));
    $t.sharedService.uiService.showApiStartPopMsg('Updating Details...');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getUsers');
    if (_type === 'education') {
      _user.experience = [];
    } else if (_type === 'experience') {
      _user.education = [];
    } else if (_type === 'headline') {
      _user.experience = [];
      _user.education = [];
    }
    $t.sharedService.configService.put(apiUrl, _user).subscribe(
      (response: any) => {
        $t.popupData.authenticationService.login(response.responseObj);
        $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
        $t.sharedService.utilityService.changeMessage('FETCH-USER-PROFILE');
        if ($t.steps[3].isActive) {
          $t.navigateInside();
        } else {
          $t.stepsClick(1, true);
        }
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getIndustry() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getLovsByGroup', { '{group}': 'Industry' });
    $t.sharedService.configService.get(apiUrl).subscribe((response) => {
      $t.industryData = response[0].value;
    });
  }

  highestDegree() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getLovsByGroup', { '{group}': 'HighestDegree' });
    $t.sharedService.configService.get(apiUrl).subscribe((response) => {
      $t.highestDegreeData = response[0].value;
    });
  }

  navigateInside() {
    let $t = this;
    $t.dialogRef.close();
    $t.router.navigate(['/social-network/posts'], { replaceUrl: true });
  }

  getUniversity(searchText: string) {
    if (searchText.length >= 3) {
      let $t = this;
      $t.universityConifg.isLoading = true;
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('getUniversityByName', {
        '{searchText}': searchText,
      });
      $t.sharedService.configService.post(apiUrl).subscribe((response: any) => {
        $t.universityConifg.data = response.responseObj;
        $t.universityConifg.isLoading = false;
      }, error => {
        $t.universityConifg.isLoading = false;
        $t.universityConifg.data = [];
      });
    }
  }

  ngOnInit(): void {
    this.initForm(this.user.type);
    if (this.user.image !== '' && this.user.experience.length === 0 && this.user.profileSummary === '') {
      this.stepsClick(0, true);
    } else if (this.user.profileSummary !== '') {
      this.stepsClick(0, true);
      this.stepsClick(1, true);
    } else if (this.user.experience.length !== 0) {
      this.stepsClick(0, true);
      this.stepsClick(1, true);
      this.stepsClick(2, true);
    }
  }

  ngAfterViewInit(): void {
    this.getIndustry();
    this.highestDegree();
  }

  get user(): any | null {
    const credentials = this.popupData.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
