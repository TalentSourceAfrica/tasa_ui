import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { CreateGroupPopupComponent } from '@app/partials/popups/group/create-group-popup/create-group-popup.component';
import { InviteUserPopupComponent } from '@app/partials/popups/group/invite-user-popup/invite-user-popup.component';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  allGroups: any = {
    data: [],
    isLoading: false,
  };

  myGroups: any = {
    data: [],
    isLoading: false,
  };

  constructor(public sharedService: SharedService, private credentialsService: CredentialsService) {}

  fetchAllGroups() {
    this.allGroups.isLoading = true;
    let apiUrl = this.sharedService.urlService.simpleApiCall('getAllActiveFroup');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.allGroups.data = response.responseObj ? response.responseObj : [];
        this.allGroups.isLoading = false;
      },
      (error) => {
        this.allGroups.isLoading = false;
      }
    );
  }

  fetchMygroup() {
    this.myGroups.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getAllActiveGroupByUser', {
      '{userId}': this.user.email,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.myGroups.data = response.responseObj ? response.responseObj : [];
        this.myGroups.isLoading = false;
      },
      (error) => {
        this.myGroups.isLoading = false;
      }
    );
  }

  sendRequest(grpId: any) {
    this.sharedService.uiService.showApiStartPopMsg('Sendind Request to Admin...');
    let apiUrl = this.sharedService.urlService.apiCallWithParams('sendRequestToGroup', {
      '{userId}': this.user.email,
      '{groupId}': grpId,
    });
    this.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        this.sharedService.uiService.showApiSuccessPopMsg('Request Send.');
      },
      (error) => {
        this.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  invitePeople(grp: any) {
    this.sharedService.dialogService.open(InviteUserPopupComponent, {
      width: '450px',
      data: { authenticationService: this, credentialsService: this.credentialsService, group: grp, user: this.user },
      disableClose: false,
    });
  }

  createGroup() {
    this.sharedService.dialogService.open(CreateGroupPopupComponent, {
      width: '450px',
      data: { authenticationService: this, credentialsService: this.credentialsService, user: this.user },
      disableClose: false,
    });
  }

  deleteGroup(_grpId: any, index: number) {
    let $t = this;
    let _callBack = () => {
      $t.sharedService.uiService.showApiStartPopMsg('Deleting...!');
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('deleteGroup', {
        '{adminId}': $t.user.email,
        '{groupId}': _grpId,
      });
      $t.sharedService.configService.delete(apiUrl).subscribe(
        (response: any) => {
          $t.myGroups.data.splice(index, 1);
          $t.sharedService.uiService.showApiSuccessPopMsg('Deleted...!');
          $t.fetchAllGroups();
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    };
    $t.sharedService.uiService.showPreConfirmPopMsg('Do You Want To Delete The Group', _callBack);
  }

  ngOnInit(): void {
    this.fetchAllGroups();
    this.fetchMygroup();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
