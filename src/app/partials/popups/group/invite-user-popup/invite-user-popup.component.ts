import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocialnetworkService } from '@app/scenes/social-network/socialnetwork.service';
import { SharedService } from '@app/services/shared.service';
import Swal from 'sweetalert2';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-invite-user-popup',
  templateUrl: './invite-user-popup.component.html',
  styleUrls: ['./invite-user-popup.component.scss'],
})
export class InviteUserPopupComponent implements OnInit {
  allUsers: any = {
    isLoading: false,
    data: [],
  };
  popupData: any;
  selectedUser: any = [];
  selectedUserIds: any = [];
  constructor(
    private socialnetworkService: SocialnetworkService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<InviteUserPopupComponent>,
    public sharedService: SharedService
  ) {
    this.popupData = data;
  }

  getAllusers() {
    let api1: any;
    let api2: any;

    // fetch Group User to remove from all user.
    let apiUrl2 = this.sharedService.urlService.apiCallWithParams('getGroupInfo', {
      '{groupId}': this.popupData.group.groupId,
    });

    api1 = this.socialnetworkService.getAllusers();
    api2 = this.sharedService.configService.get(apiUrl2);

    this.allUsers.isLoading = true;

    forkJoin([api1, api2]).subscribe(
      (response: any) => {
        let result1 = response[0].filter((d: any) => d.emailVerified === 'Y');
        let result2 = response[1].responseObj.members;
        const grpMembersEmailList = result2.map((d: any) => d.email);
        this.allUsers.data = result1.filter((d: any) => !grpMembersEmailList.includes(d.email));
        this.allUsers.isLoading = false;
      },
      (error) => {}
    );
  }

  onUserSelection(event: any, id: number) {
    if (this.selectedUser.includes(id)) {
      const index = this.selectedUser.indexOf(id);
      if (index > -1) {
        this.selectedUser.splice(index, 1);
      }
    } else {
      this.selectedUser.push(id);
    }
  }

  submit() {
    Swal.fire({
      title: 'Message',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        placeholder: 'Type Your Message',
      },
      showCancelButton: true,
      confirmButtonText: 'Send',
      confirmButtonClass: 'rounded-pill shadow-sm',
      cancelButtonClass: 'rounded-pill shadow-sm',
      showLoaderOnConfirm: true,
      preConfirm: (data) => {
        if (data === '') {
          Swal.showValidationMessage('Please enter message');
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result) {
        if (result.dismiss) {
          Swal.close();
        }
        if (result.value) {
          let payload = {
            users: this.selectedUserIds,
            message: result.value,
          };
          this.sharedService.uiService.showApiStartPopMsg('Inviting User(s)...');
          // sendRequestToMultiplePeople
          console.log(this.selectedUserIds);
          let apiUrl = this.sharedService.urlService.apiCallWithParams('sendRequestToMultiplePeople', {
            '{adminId}': this.popupData.user.email,
            '{groupId}': this.popupData.group.groupId,
          });
          this.sharedService.configService.post(apiUrl, payload).subscribe(
            (response: any) => {
              this.sharedService.uiService.showApiSuccessPopMsg(response.message);
              this.dialogRef.close();
            },
            (error) => {
              this.sharedService.uiService.showApiErrorPopMsg(error.error.message);
            }
          );
        }
      }
    });
  }

  ngOnInit(): void {
    this.getAllusers();
  }
}
