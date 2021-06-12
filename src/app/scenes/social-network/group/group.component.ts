import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from '@app/@core';
import { CredentialsService } from '@app/auth';
import { CreateGroupPopupComponent } from '@app/partials/popups/group/create-group-popup/create-group-popup.component';
import { GroupViewPopupComponent } from '@app/partials/popups/group/group-view-popup/group-view-popup.component';
import { InviteUserPopupComponent } from '@app/partials/popups/group/invite-user-popup/invite-user-popup.component';
import { SharedService } from '@app/services/shared.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  private currMsgSubscribe = new Subscription();
  groupSearchText: string = '';
  myGroupSearchText: string = '';
  allGroups: any = {
    data: [],
    isLoading: false,
  };
  myGroups: any = {
    data: [],
    isLoading: false,
  };

  constructor(
    public sharedService: SharedService,
    private credentialsService: CredentialsService,
    private router: Router
  ) {}

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
    // Swal.fire({
    //   title: 'Add A Note',
    //   input: 'text',
    //   inputAttributes: {
    //     autocapitalize: 'off',
    //     placeholder: 'Type Your Message',
    //   },
    //   showCancelButton: true,
    //   confirmButtonText: 'Send',
    //   confirmButtonClass: 'rounded-pill shadow-sm',
    //   cancelButtonClass: 'rounded-pill shadow-sm',
    //   showLoaderOnConfirm: true,
    //   preConfirm: (data) => {
    //     if (data === '') {
    //       Swal.showValidationMessage('Please enter message');
    //     }
    //   },
    //   allowOutsideClick: () => !Swal.isLoading(),
    // }).then((result) => {
    //   if (result) {
    //     if (result.dismiss) {
    //       Swal.close();
    //     }
    //     if (result.value) {
    //     }
    //   }
    // });

    this.sharedService.uiService.showApiStartPopMsg('Sending Request to Admin...');
    let apiUrl = this.sharedService.urlService.apiCallWithParams('sendRequestToGroup', {
      '{userId}': this.user.email,
      '{groupId}': grpId,
    });
    this.sharedService.configService.post(apiUrl, 'message').subscribe(
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

  viewGroup(_group: any) {
    this.router.navigate(['/group/', _group.groupId], { replaceUrl: true });
    // this.sharedService.dialogService.open(GroupViewPopupComponent, {
    //   width: '450px',
    //   data: {
    //     authenticationService: this,
    //     credentialsService: this.credentialsService,
    //     group: _group,
    //     user: this.user,
    //   },
    //   disableClose: false,
    // });
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

    this.currMsgSubscribe = this.sharedService.utilityService.currentMessage
      .pipe(delay(10), untilDestroyed(this))
      .subscribe((message) => {
        if (message === 'TRIGGER-ALL-GROUP') {
          this.fetchAllGroups();
          this.fetchMygroup();
        }
      });
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnDestroy(): void {
    this.currMsgSubscribe.unsubscribe();
  }
}
