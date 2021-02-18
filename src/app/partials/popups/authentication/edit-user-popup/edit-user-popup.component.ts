import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { suportedFile } from '@app/models/constants';
import { SharedService } from '@app/services/shared.service';
import { element } from 'protractor';

@Component({
  selector: 'app-edit-user-popup',
  templateUrl: './edit-user-popup.component.html',
  styleUrls: ['./edit-user-popup.component.scss'],
})
export class EditUserPopupComponent implements OnInit {
  @ViewChild('uploadCertificate', { static: false }) public upCert: any;
  popupData: any;
  countries: any;
  certificateSuportedFile = suportedFile.certificate;
  user: any;
  //chips
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  skillSet: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditUserPopupComponent>,
    public sharedService: SharedService,
    public cdr: ChangeDetectorRef
  ) {
    this.popupData = data;
  }

  submit() {
    let $t = this;
    if ($t.checkValidation()) {
      $t.sharedService.uiService.showApiStartPopMsg('Updating Details...');
      let apiUrl = $t.sharedService.urlService.simpleApiCall('getUsers');
      $t.sharedService.configService.put(apiUrl, $t.user).subscribe(
        (response: any) => {
          $t.popupData.authenticationService.login(response.responseObj);
          $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
          $t.sharedService.utilityService.changeMessage('FETCH-USER-PROFILE');
          $t.dialogRef.close();
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    } else {
      $t.sharedService.uiService.showApiErrorPopMsg('Please fill out all the compulsory fields');
    }
  }

  checkValidation() {
    let isValid: boolean = true;
    if (this.popupData.userConfigToUpdate.type === 'Experience') {
      this.user.experience.forEach((element: any) => {
        if (
          element.currentRole[0] === '' ||
          element.organization === '' ||
          element.description === '' ||
          element.experienceFrom === '' ||
          element.experience === 'false' ? element.experienceTo == null || element.experienceTo === '' : false
        ) {
          isValid = false;
        } else {
          isValid = true;
        }
      });
    } else if (this.popupData.userConfigToUpdate.type === 'Education') {
      this.user.education.forEach((element: any) => {
        if (
          element.college[0] === '' ||
          element.highestDegree === '' ||
          element.major === '' ||
          element.degreeFromDate === '' ||
          element.minor[0] === '' ||
          element.university[0] === '' ||
          element.degreeToDate === ''
        ) {
          isValid = false;
        } else {
          isValid = true;
        }
      });
    } else if (this.popupData.userConfigToUpdate.type === 'About') {
      this.popupData.userConfigToUpdate.data.forEach((element: any) => {
        if (element['isRequired']) {
          this.user[element.key] === '' ? (isValid = false) : null;
        }
      });
    } else if (this.popupData.userConfigToUpdate.type === 'Freelancer') {
      this.user.pastGigs.forEach((element: any) => {
        if (
          element.projectName === '' ||
          element.projectDesc === '' ||
          element.clientName === '' ||
          element.projectDuration === ''
        ) {
          isValid = false;
        } else {
          isValid = true;
        }
      });
    } else if (this.popupData.userConfigToUpdate.type === 'Certificate') {
      this.user.certificate.forEach((element: any) => {
        if (element.certificateName === '') {
          isValid = false;
        } else {
          isValid = true;
        }
      });
    } else {
      isValid = true;
    }
    return isValid;
  }

  addExp() {
    this.user.experience.push({
      currentRole: [''],
      description: [''],
      experience: 'false',
      experienceFrom: '',
      experienceTo: '',
      organization: '',
    });
    this.cdr.detectChanges();
  }

  addEdu() {
    this.user.education.push({
      college: [''],
      degreeFromDate: '',
      degreeToDate: '',
      highestDegree: '',
      major: '',
      minor: [''],
      university: [''],
    });
    this.cdr.detectChanges();
  }

  addGig() {
    this.user.pastGigs.push({
      projectName: '',
      projectDesc: '',
      projectDuration: '',
      projectURL: '',
      clientName: '',
      clientWebsite: '',
    });
    this.cdr.detectChanges();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.user.fieldsOfExpertise.push({
        areaOfExpertise: value.trim(),
      });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(skill: any): void {
    const index = this.user.fieldsOfExpertise.indexOf(skill);

    if (index >= 0) {
      this.user.fieldsOfExpertise.splice(index, 1);
    }
  }

  removeExp(index: number) {
    this.user.experience.splice(index, 1);
  }
  removeEdu(index: number) {
    this.user.education.splice(index, 1);
  }
  removeGig(index: number) {
    this.user.pastGigs.splice(index, 1);
  }
  removeCertificate(index: number) {
    this.user.certificate.splice(index, 1);
  }

  triggerUpload() {
    this.upCert.nativeElement.click();
  }

  uploadFile(_event: any) {
    // if (Extension == 'pdf' || Extension == 'png' || Extension == 'jpeg' || Extension == 'jpg') {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadSingle', { '{email}': $t.user.email });
    let files = _event.target.files;
    var form = new FormData();
    form.append('file', files[0], files[0].name);
    if ($t.sharedService.utilityService.ValidateCertificateUpload(files[0].name).result) {
      $t.sharedService.uiService.showApiStartPopMsg('Uploading Certificate...');
      $t.sharedService.configService.post(apiUrl, form).subscribe(
        (response: any) => {
          const type =
            files[0].name.substring(files[0].name.lastIndexOf('.') + 1).toLowerCase() === 'pdf' ? 'pdf' : 'image';
          $t.user.certificate.unshift({
            certificateName: '',
            certificateType: type,
            certificates: [response.url],
          });
          $t.sharedService.uiService.showApiSuccessPopMsg('Certificate Uploaded...');
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
        }
      );
    } else {
      $t.sharedService.uiService.showApiErrorPopMsg('Please select a valid file.');
    }
  }

  getCountry() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getCountry');

    $t.sharedService.configService.get(apiUrl).subscribe((response) => {
      $t.countries = response;
    });
  }

  ngOnInit(): void {
    this.user = JSON.parse(JSON.stringify(this.popupData.user));
    this.getCountry();
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  // get user(): any | null {
  //   const credentials = this.popupData.credentialsService.credentials;
  //   return credentials ? Object.assign(credentials) : null;
  // }
}
