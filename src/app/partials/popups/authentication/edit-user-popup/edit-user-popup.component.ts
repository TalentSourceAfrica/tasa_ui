import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-edit-user-popup',
  templateUrl: './edit-user-popup.component.html',
  styleUrls: ['./edit-user-popup.component.scss'],
})
export class EditUserPopupComponent implements OnInit {
  popupData: any;
  countries: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditUserPopupComponent>,
    public sharedService: SharedService
  ) {
    this.popupData = data;
  }

  submit() {
    let $t = this;
    if ($t.checkValidation()) {
      $t.sharedService.uiService.showApiStartPopMsg('Updating Details...');
      let apiUrl = $t.sharedService.urlService.simpleApiCall('getUsers');
      $t.sharedService.configService.put(apiUrl, $t.user).subscribe(
        (response) => {
          $t.popupData.authenticationService.login(response);
          $t.sharedService.uiService.showApiSuccessPopMsg('User Updated Successfully');
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
          element.experienceTo === ''
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
    } else {
      isValid = true;
    }
    return isValid;
  }

  addExp() {
    this.user.experience.push({
      currentRole: [''],
      description: [''],
      experience: '',
      experienceFrom: '',
      experienceTo: '',
      organization: '',
    });
  }
  
  addEdu() {
    this.user.experience.push({
      college: [''],
      degreeFromDate: '',
      degreeToDate: '',
      highestDegree: '',
      major: '',
      minor: [''],
      university: [''],
    });
  }

  removeExp(index: number) {
    this.user.experience.splice(index, 1);
  }
  removeEdu(index: number) {
    this.user.education.splice(index, 1);
  }

  getCountry() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getCountry');

    $t.sharedService.configService.get(apiUrl).subscribe((response) => {
      $t.countries = response;
    });
  }

  ngOnInit(): void {
    this.getCountry();
  }

  get user(): any | null {
    const credentials = this.popupData.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
