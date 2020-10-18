import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

//service
import { SharedService } from '@app/services/shared.service';
import { Router } from '@angular/router';
import { AuthenticationService, CredentialsService } from '@app/auth';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  userDetailsForm: FormGroup;
  personalDetailsForm: FormGroup;
  educationDetailsForm: FormGroup;
  experienceDetailsForm: FormGroup;
  teachingExperienceForm: FormGroup;
  careerPreferenceDetailsForm: FormGroup;
  organizationDetailsForm: FormGroup;
  socialDetailsForm: FormGroup;
  careerOpeningDetailsForm: FormGroup;
  userDetails: any;
  showMandatoryMessage: boolean = false;
  countries: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService
  ) {
    this.userDetails = JSON.parse(JSON.stringify(this.user));
  }

  suffixes = [
    {code: 'master', label: 'Master'},
    {code: 'miss', label: 'Miss'},
    {code: 'mr', label: 'Mr'},
    {code: 'mrs', label: 'Mrs'}
  ];

  personalDetails = [
    {id: 'tasaId', label: 'TaSA ID', type: 'text', formControlName: 'tasaId', placeholder: 'Your TaSA ID', prepend: 'far fa-id-card', mandatory: false},
    {id: 'ein', label: 'EIN', type: 'text', formControlName: 'ein', placeholder: 'EIN', prepend: 'fas fa-user', mandatory: false},
    {id: 'suffix', label: 'Suffix', type: 'text', formControlName: 'suffix', placeholder: 'Your Preferred Suffix', prepend: 'fas fa-user', mandatory: false},
    {id: 'firName', label: 'First Name', type: 'text', formControlName: 'firstName', placeholder: 'Your First Name', prepend: 'fas fa-user', mandatory: false},
    {id: 'midName', label: 'Middle Name', type: 'text', formControlName: 'middleName', placeholder: 'Your Middle Name', prepend: 'fas fa-user', mandatory: false},
    {id: 'lastName', label: 'Last Name', type: 'text', formControlName: 'lastName', placeholder: 'Your Last Name', prepend: 'fas fa-user', mandatory: false},
    {id: 'emailId', label: 'Email ID', type: 'email', formControlName: 'email', placeholder: 'Your Email ID', prepend: 'fas fa-at', mandatory: false},
    {id: 'dob', label: 'Date Of Birth', type: 'date', formControlName: 'dob', placeholder: 'Your Date Of Birth', prepend: 'fas fa-calendar-day', mandatory: false},
    {id: 'address1', label: 'Address 1', type: 'text', formControlName: 'addressLine1', placeholder: 'Your Address', prepend: 'far fa-address-card', mandatory: true},
    {id: 'address2', label: 'Address 2', type: 'text', formControlName: 'addressLine2', placeholder: 'Your Address', prepend: 'far fa-address-card', mandatory: false},
    {id: 'country', label: 'Country', type: 'text', formControlName: 'country', placeholder: 'Your Country', prepend: 'far fa-flag', mandatory: true},
    {id: 'state', label: 'State', type: 'text', formControlName: 'state', placeholder: 'Your State', prepend: 'far fa-flag', mandatory: true},
    {id: 'city', label: 'City', type: 'text', formControlName: 'city', placeholder: 'Your City', prepend: 'far fa-flag', mandatory: true},
    {id: 'district', label: 'District/Province', type: 'text', formControlName: 'district', placeholder: 'Your District/Province', prepend: 'far fa-flag', mandatory: false},
    {id: 'postalCode', label: 'Postal Code', type: 'text', formControlName: 'postalCode', placeholder: 'Your Postal Code', prepend: 'far fa-envelope', mandatory: true},
    {id: 'language', label: 'Language', type: 'text', formControlName: 'language', placeholder: 'Your Language', prepend: 'fas fa-language', mandatory: false},
    {id: 'identifier', label: 'SSN/Identifier', type: 'text', formControlName: 'identifier', placeholder: 'Your SSN/Identifier', prepend: 'far fa-id-badge', mandatory: false},
    {id: 'bio', label: 'Bio', type: 'text', formControlName: 'bio', placeholder: 'Information about yourself, your achievments, your interests, your passions, etc', prepend: 'fas fa-info', mandatory: false},
    {id: 'billingAdd1', label: 'Billing Address 1', type: 'text', formControlName: 'billingAdd1', placeholder: 'Your Billing Address', prepend: 'far fa-flag', mandatory: false},
    {id: 'billingAdd2', label: 'Billing Address 2', type: 'text', formControlName: 'billingAdd2', placeholder: 'Your Billing Address', prepend: 'far fa-flag', mandatory: false},
    {id: 'billingCity', label: 'Billing City', type: 'text', formControlName: 'billingCity', placeholder: 'Your Billing City', prepend: 'far fa-flag', mandatory: false},
    {id: 'billingState', label: 'Billing State', type: 'text', formControlName: 'billingState', placeholder: 'Your Billing State', prepend: 'far fa-flag', mandatory: false},
    {id: 'billingPostalCode', label: 'Billing Postal Code', type: 'text', formControlName: 'billingPostalCode', placeholder: 'Your Billing Postal Code', prepend: 'far fa-flag', mandatory: false}
  ];

  educationDetails = [
    {id: 'highestDegree', label: 'Highest Degree', type: 'text', formControlName: 'highestDegree', placeholder: 'Your Highest Degree', prepend: 'fas fa-graduation-cap w10', mandatory: true},
    {id: 'college', label: 'College', type: 'text', formControlName: 'college', placeholder: 'Your College', prepend: 'fas fa-school w10', mandatory: true},
    {id: 'university', label: 'University', type: 'text', formControlName: 'university', placeholder: 'Your University', prepend: 'fas fa-university w10', mandatory: true},
    {id: 'major', label: 'Major', type: 'text', formControlName: 'major', placeholder: 'Your Major', prepend: 'fas fa-user-graduate w10', mandatory: true},
    {id: 'minor1', label: 'Minor 1', type: 'text', formControlName: 'minor1', placeholder: 'Your Minor', prepend: 'fas fa-user-graduate w10', mandatory: false},
    {id: 'minor2', label: 'Minor 2', type: 'text', formControlName: 'minor2', placeholder: 'Your Minor', prepend: 'fas fa-user-graduate w10', mandatory: false},
    {id: 'minor3', label: 'Minor 3', type: 'text', formControlName: 'minor3', placeholder: 'Your Minor', prepend: 'fas fa-user-graduate w10', mandatory: false},
    {id: 'certificate', label: 'Certificates', type: 'text', formControlName: 'certificate', placeholder: 'Your Certificate', prepend: 'fas fa-award w10', mandatory: true},
  ];

  experienceDetails = [
    {id: 'experience', label: 'Experience', type: 'text', formControlName: 'experience', placeholder: 'Your Experience', prepend: 'fas fa-briefcase', mandatory: true},
    {id: 'organization', label: 'Current Organization', type: 'text', formControlName: 'organization', placeholder: 'Your Current Organization', prepend: 'far fa-building', mandatory: true},
    {id: 'currentRole', label: 'Current Role', type: 'text', formControlName: 'currentRole', placeholder: 'Your Current Role', prepend: 'fas fa-user-tie', mandatory: true},
    {id: 'project1', label: 'Latest Project Details 1', type: 'text', formControlName: 'project1', placeholder: 'Latest Projects Implemented Details', prepend: 'fas fa-project-diagram', mandatory: false},
    {id: 'project2', label: 'Latest Project Details 2', type: 'text', formControlName: 'project2', placeholder: 'Latest Projects Implemented Details', prepend: 'fas fa-project-diagram', mandatory: false},
    {id: 'project3', label: 'Latest Project Details 3', type: 'text', formControlName: 'project3', placeholder: 'Latest Projects Implemented Details', prepend: 'fas fa-project-diagram', mandatory: false}
  ];

  teachingExperienceDetails = [
    {id: 'teachingExperience', label: 'Teaching Experience', type: 'text', formControlName: 'teachingExperience', placeholder: 'Your Teaching Experience', prepend: 'fas fa-briefcase', mandatory: true},
    {id: 'universityTought', label: 'University Taught', type: 'text', formControlName: 'universityTought', placeholder: 'Your University Taught', prepend: 'far fa-building', mandatory: false},
    {id: 'collegeTought', label: 'collegeTought', type: 'text', formControlName: 'collegeTought', placeholder: 'Your College Taught', prepend: 'fas fa-user-tie', mandatory: false},
    {id: 'specialization', label: 'Specialization', type: 'text', formControlName: 'specialization', placeholder: 'Your Specialization', prepend: 'fas fa-user-tie', mandatory: false},
    {id: 'licenseNo', label: 'License Number', type: 'text', formControlName: 'licenseNo', placeholder: 'Your License Number', prepend: 'fas fa-user-tie', mandatory: false}
  ];

  careerPreferenceDetails = [
    {id: 'areaOfPreference', label: 'Area Of Preference', type: 'text', formControlName: 'areaOfPreference', placeholder: 'Your Area Of Preference', prepend: 'fas fa-chalkboard-teacher', mandatory: true},
    {id: 'preferredRole', label: 'Preferred Role', type: 'text', formControlName: 'preferredRole', placeholder: 'Your Preferred Role', prepend: 'fas fa-user-tie', mandatory: true},
    {id: 'careerGoals', label: 'Career Goals', type: 'text', formControlName: 'careerGoals', placeholder: 'Your Career Goals', prepend: 'fas fa-bullseye', mandatory: true}
  ];

  organizationDetails = [
    {id: 'organizationName', label: 'Organization Name', type: 'text', formControlName: 'organizationName', placeholder: 'Your Organization Name', prepend: 'fas fa-sitemap', mandatory: true},
    {id: 'location', label: 'Location', type: 'text', formControlName: 'location', placeholder: 'Your Location', prepend: 'far fa-address-card', mandatory: true},
    {id: 'description', label: 'Description', type: 'text', formControlName: 'description', placeholder: 'Your Description', prepend: 'far fa-flag', mandatory: true},
    {id: 'about', label: 'About', type: 'text', formControlName: 'about', placeholder: 'Your About', prepend: 'far fa-flag', mandatory: true},
    {id: 'noEmp', label: 'Number Of Employees', type: 'text', formControlName: 'noEmp', placeholder: 'Your Numer Of Employees', prepend: 'far fa-flag', mandatory: true},
    {id: 'industry', label: 'Industry', type: 'text', formControlName: 'industry', placeholder: 'Your Industry', prepend: 'far fa-envelope', mandatory: true},
    {id: 'team', label: 'Team', type: 'text', formControlName: 'team', placeholder: 'Your Team', prepend: 'fas fa-users', mandatory: false}
  ];

  socialDetails = [
    {id: 'contactNo', label: 'Contact Number', type: 'text', formControlName: 'contactNo', placeholder: 'Your Contact Number', prepend: 'far fa-address-card', mandatory: true},
    {id: 'contactEmail', label: 'Contact Email Address', type: 'email', formControlName: 'contactEmail', placeholder: 'Your Contact Email Address', prepend: 'far fa-envelope', mandatory: true},
    {id: 'website', label: 'Website', type: 'text', formControlName: 'website', placeholder: 'Your Website', prepend: 'far fa-flag', mandatory: true},
    {id: 'linkedin', label: 'Linkedin', type: 'text', formControlName: 'linkedin', placeholder: 'Your Linkedin', prepend: 'far fa-flag', mandatory: true},
    {id: 'twitter', label: 'Twitter', type: 'text', formControlName: 'twitter', placeholder: 'Your Twitter', prepend: 'far fa-flag', mandatory: true}
  ];

  careerOpeningDetails = [
    {id: 'noOfOpenings', label: 'Number Of Openings', type: 'text', formControlName: 'noOfOpenings', placeholder: 'Number Of Openings', prepend: 'fas fa-briefcase', mandatory: false},
    {id: 'natureOfOpening', label: 'Nature Of Opening', type: 'text', formControlName: 'natureOfOpening', placeholder: 'Nature Of Opening', prepend: 'fas fa-briefcase', mandatory: false},
    {id: 'clients', label: 'Clients', type: 'text', formControlName: 'clients', placeholder: 'Your Clients', prepend: 'fas fa-users', mandatory: false},
    {id: 'collaborator', label: 'Collaboator', type: 'text', formControlName: 'collaborator', placeholder: 'Your Collaborators', prepend: 'fas fa-users', mandatory: false},
    {id: 'dateOfEstablishment', label: 'Date Of Establishment', type: 'date', formControlName: 'dateOfEstablishment', placeholder: 'Date Of Establishment', prepend: 'fas fa-calendar-day', mandatory: false}
  ];

  initForm(_type: string) {
    switch (_type) {
      case 'Mentor':
        this.personalDetailsForm = this.formBuilder.group({
          tasaId: [''],
          suffix: [''],
          firstName: [''],
          middleName: [''],
          lastName: [''],
          email: [''],
          dob: [''],
          addressLine1: ['', [Validators.required]],
          addressLine2: [''],
          country: ['', [Validators.required]],
          state: ['', [Validators.required]],
          city: ['', [Validators.required]],
          district: [''],
          postalCode: ['', [Validators.required]],
          language: [''],
          identifier: [''],
          bio: [''],
          billingAdd1: [''],
          billingAdd2: [''],
          billingCity: [''],
          billingState: [''],
          billingPostalCode: ['']
        });
         this.educationDetailsForm = this.formBuilder.group({
          highestDegree: ['', [Validators.required]],
          college: ['', [Validators.required]],
          university: ['', [Validators.required]],
          major: ['', [Validators.required]],
          minor1: [''],
          minor2: [''],
          minor3: [''],
          certificate: ['', [Validators.required]]
        });
        this.experienceDetailsForm = this.formBuilder.group({
          experience: ['', [Validators.required]],
          organization: ['', [Validators.required]],
          currentRole: ['', [Validators.required]],
          project1: [''],
          project2: [''],
          project3: ['']
        });
        this.teachingExperienceForm = this.formBuilder.group({
          teachingExperience: ['', [Validators.required]],
          universityTought: [''],
          collegeTought: [''],
          specialization: [''],
          licenseNo: [''],
        });
        this.careerPreferenceDetailsForm = this.formBuilder.group({
          areaOfPreference: ['', [Validators.required]],
          preferredRole: ['', [Validators.required]],
          careerGoals: ['', [Validators.required]],
        });
        break;
      case 'Recruiter':
        this.organizationDetailsForm = this.formBuilder.group({
          organizationName: ['', [Validators.required]],
          location: ['', [Validators.required]],
          description: ['', [Validators.required]],
          about: ['', [Validators.required]],
          noEmp: ['', [Validators.required]],
          industry: ['', [Validators.required]],
          team: ['']
        });
        this.socialDetailsForm = this.formBuilder.group({
          contactNo: ['', [Validators.required]],
          contactEmail: ['', [Validators.required]],
          website: ['', [Validators.required]],
          linkedin: ['', [Validators.required]],
          twitter: ['', [Validators.required]],
        });
        this.personalDetailsForm = this.formBuilder.group({
          tasaId: [''],
          ein: [''],
          suffix: [''],
          firstName: [''],
          middleName: [''],
          lastName: [''],
          email: [''],
          dob: [''],
          addressLine1: ['', [Validators.required]],
          addressLine2: [''],
          country: ['', [Validators.required]],
          state: ['', [Validators.required]],
          city: ['', [Validators.required]],
          district: [''],
          postalCode: ['', [Validators.required]],
          language: [''],
          identifier: [''],
          bio: [''],
          billingAdd1: [''],
          billingAdd2: [''],
          billingCity: [''],
          billingState: [''],
          billingPostalCode: ['']
        });
        this.careerOpeningDetailsForm = this.formBuilder.group({
          noOfOpenings: [''],
          natureOfOpening: [''],
          clients: [''],
          collaborator: [''],
          dateOfEstablishment: ['']
        });
        break;
      default:
        this.personalDetailsForm = this.formBuilder.group({
          tasaId: [{value:this.user.tasaId, disabled: true}],
          suffix: [this.user.suffix],
          firstName: [this.user.firstName],
          middleName: [this.user.middleName],
          lastName: [this.user.lastName],
          email: [this.user.email],
          dob: [this.user.dob],
          addressLine1: [this.user.address1, [Validators.required]],
          addressLine2: [this.user.address2],
          country: [this.user.country, [Validators.required]],
          state: [this.user.state, [Validators.required]],
          city: [this.user.city, [Validators.required]],
          district: [this.user.district],
          postalCode: [this.user.postalCode, [Validators.required]],
          language: [this.user.language],
          identifier: [this.user.identifier],
          bio: [this.user.bio],
          billingAdd1: [this.user.billingAddress1],
          billingAdd2: [this.user.billingAddress2],
          billingCity: [this.user.getbCity],
          billingState: [this.user.getbState],
          billingPostalCode: [this.user.getbPostalCode]
        });
        this.educationDetailsForm = this.formBuilder.group({
          highestDegree: [this.user.highestDegree, [Validators.required]],
          college: [this.user.college, [Validators.required]],
          university: [this.user.university, [Validators.required]],
          major: [this.user.major, [Validators.required]],
          minor1: [this.user.minor1],
          minor2: [this.user.minor2],
          minor3: [this.user.minor3],
          certificate: [this.user.certificate, [Validators.required]]
        });
        this.experienceDetailsForm = this.formBuilder.group({
          experience: [this.user.experience, [Validators.required]],
          organization: [this.user.organization, [Validators.required]],
          currentRole: [this.user.currentRole, [Validators.required]],
          project1: [this.user.project1],
          project2: [this.user.project2],
          project3: [this.user.project3]
        });
        this.careerPreferenceDetailsForm = this.formBuilder.group({
          areaOfPreference: [this.user.areaOfPreference, [Validators.required]],
          preferredRole: [this.user.preferredRole, [Validators.required]],
          careerGoals: [this.user.careerGoals, [Validators.required]],
        });
    }
  }

  getCountry() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getCountry');

    $t.sharedService.configService.get(apiUrl).subscribe((response) => {
      $t.countries = response;
    });
  }

  onObjSubmit(_type: string) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Adding Details...');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getUsers');
    $t.setUserDetailsObjValues(_type);
    $t.sharedService.configService.put(apiUrl, $t.userDetails).subscribe(
      (response: any) => {
        $t.authenticationService.login(response);
        $t.sharedService.uiService.showApiSuccessPopMsg('Details Added Successfully');
      },
      (error: any) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  setUserDetailsObjValues(_type: string) {
    let $t = this;
    let personalDetailsValues = $t.personalDetailsForm.value;
    $t.userDetails.suffix = personalDetailsValues.suffix;
    $t.userDetails.firstName = personalDetailsValues.firstName;
    $t.userDetails.middleName = personalDetailsValues.middleName;
    $t.userDetails.lastName = personalDetailsValues.lastName;
    $t.userDetails.email = personalDetailsValues.email;
    $t.userDetails.dob = personalDetailsValues.dob;
    $t.userDetails.address1 = personalDetailsValues.addressLine1;
    $t.userDetails.address2 = personalDetailsValues.addressLine2;
    $t.userDetails.country = personalDetailsValues.country;
    $t.userDetails.state = personalDetailsValues.state;
    $t.userDetails.city = personalDetailsValues.city;
    $t.userDetails.district = personalDetailsValues.district;
    $t.userDetails.postalCode = personalDetailsValues.postalCode;
    $t.userDetails.language = personalDetailsValues.language;
    $t.userDetails.identifier = personalDetailsValues.identifier;
    $t.userDetails.bio = personalDetailsValues.bio;
    $t.userDetails.billingAddress1 = personalDetailsValues.billingAdd1;
    $t.userDetails.billingAddress2 = personalDetailsValues.billingAdd2;
    $t.userDetails.getbCity = personalDetailsValues.billingCity;
    $t.userDetails.getbState = personalDetailsValues.billingState;
    $t.userDetails.getbPostalCode = personalDetailsValues.billingPostalCode;
    if (_type != 'Recruiter') {
      let educationDetailsValues = $t.educationDetailsForm.value;
      $t.userDetails.highestDegree = educationDetailsValues.highestDegree;
      $t.userDetails.college = educationDetailsValues.college;
      $t.userDetails.university = educationDetailsValues.university;
      $t.userDetails.major = educationDetailsValues.major;
      $t.userDetails.minor1 = educationDetailsValues.minor1;
      $t.userDetails.minor2 = educationDetailsValues.minor2;
      $t.userDetails.minor3 = educationDetailsValues.minor3;
      $t.userDetails.certificate = educationDetailsValues.certificate;
      let experienceDetailsValues = $t.experienceDetailsForm.value;
      $t.userDetails.experience = experienceDetailsValues.experience;
      $t.userDetails.organization = experienceDetailsValues.organization;
      $t.userDetails.currentRole = experienceDetailsValues.currentRole;
      $t.userDetails.project1 = experienceDetailsValues.project1;
      $t.userDetails.project2 = experienceDetailsValues.project2;
      $t.userDetails.project3 = experienceDetailsValues.project3;
      let careerPreferenceDetailsValues = $t.careerPreferenceDetailsForm.value;
      $t.userDetails.areaOfPreference = careerPreferenceDetailsValues.areaOfPreference;
      $t.userDetails.preferredRole = careerPreferenceDetailsValues.preferredRole;
      $t.userDetails.careerGoals = careerPreferenceDetailsValues.careerGoals;
    }
    if (_type == 'Mentor') {
      let teachingExperienceValues = $t.teachingExperienceForm.value;
      $t.userDetails.teachingExperience = teachingExperienceValues.teachingExperience;
      $t.userDetails.univTought = teachingExperienceValues.universityTought;
      $t.userDetails.collegeTaught = teachingExperienceValues.collegeTaught;
      $t.userDetails.specialization = teachingExperienceValues.specialization;
      $t.userDetails.licenseNo = teachingExperienceValues.licenseNo;
    }
    if (_type == 'Recruiter') {
      let organizationDetailsValues = $t.organizationDetailsForm.value;
      $t.userDetails.organizationName = organizationDetailsValues.organizationName;
      $t.userDetails.location = organizationDetailsValues.location;
      $t.userDetails.description = organizationDetailsValues.description;
      $t.userDetails.about = organizationDetailsValues.about;
      $t.userDetails.noEmp = organizationDetailsValues.noEmp;
      $t.userDetails.industry = organizationDetailsValues.industry;
      $t.userDetails.team = organizationDetailsValues.team;
      let socialDetailsValues = $t.socialDetailsForm.value;
      $t.userDetails.contactNo = socialDetailsValues.contactNo;
      $t.userDetails.contactEmail = socialDetailsValues.contactEmail;
      $t.userDetails.website = socialDetailsValues.website;
      $t.userDetails.linkedin = socialDetailsValues.linkedin;
      $t.userDetails.twitter = socialDetailsValues.twitter;
      let careerOpeningDetailsValues = $t.careerPreferenceDetailsForm.value;
      $t.userDetails.noOfOpenings = careerOpeningDetailsValues.noOfOpenings;
      $t.userDetails.natureOfOpening = careerOpeningDetailsValues.natureOfOpening;
      $t.userDetails.clients = careerOpeningDetailsValues.clients;
      $t.userDetails.collaborator = careerOpeningDetailsValues.collaborator;
      $t.userDetails.dateOfEstablishment = careerOpeningDetailsValues.dateOfEstablishment;
    }
    console.log($t.userDetails);
    return ;
  }

  submitDetails(_type: string) {
    let $t = this;
    switch(_type) {
      case 'Mentor':
        if ($t.personalDetailsForm.invalid || $t.educationDetailsForm.invalid || $t.experienceDetailsForm.invalid ||
            $t.teachingExperienceForm.invalid || $t.careerPreferenceDetailsForm.invalid) {
          $t.showMandatoryMessage = true;
          return ;
        } else {
          $t.showMandatoryMessage = false;
          $t.onObjSubmit(_type);
        }
        break;
      case 'Mentee':
        if ($t.personalDetailsForm.invalid || $t.educationDetailsForm.invalid || 
            $t.experienceDetailsForm.invalid || $t.careerPreferenceDetailsForm.invalid) {
          $t.showMandatoryMessage = true;
          return ;
        } else {
          $t.showMandatoryMessage = false;
          $t.onObjSubmit(_type);
        }
        break;
      case 'Recruiter':
        if ($t.personalDetailsForm.invalid || $t.organizationDetailsForm.invalid || $t.socialDetailsForm.invalid) {
          $t.showMandatoryMessage = true;
          return ;
        } else {
          $t.showMandatoryMessage = false;
          $t.onObjSubmit(_type);
        }
        break;    
    }
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.initForm(this.user.type);
    this.getCountry();
  }
}
