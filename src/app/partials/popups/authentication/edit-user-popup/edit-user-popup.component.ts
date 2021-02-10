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
    console.log(this.user);
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Updating Details...');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getUsers');
    $t.sharedService.configService.put(apiUrl, $t.user).subscribe(
      (response) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('User Updated Successfully');
        $t.sharedService.utilityService.changeMessage('FETCH-USER-PROFILE');
        $t.dialogRef.close();
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
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
