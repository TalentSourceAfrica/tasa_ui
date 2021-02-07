import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocialnetworkService } from '@app/scenes/social-network/socialnetwork.service';
import { SharedService } from '@app/services/shared.service';
import Swal from 'sweetalert2';

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
  selectedUser: any;
  popupData: any;
  constructor(
    private socialnetworkService: SocialnetworkService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<InviteUserPopupComponent>,
    public sharedService: SharedService
  ) {
    this.popupData = data;
  }

  getAllusers() {
    this.allUsers.isLoading = true;
    this.socialnetworkService.getAllusers().subscribe(
      (response) => {
        this.allUsers.data = response;
        this.allUsers.isLoading = false;
      },
      (error) => {}
    );
  }

  submit() {
    Swal.fire({
      title: 'Why do you want to join ?',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
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
          this.sharedService.uiService.showApiStartPopMsg('Inviting User...');
          let apiUrl = this.sharedService.urlService.apiCallWithParams('sendRequestToPeople', {
            '{adminId}': this.popupData.user.email,
            '{userId}': this.selectedUser.email,
            '{groupId}': this.popupData.group.groupId,
          });
          this.sharedService.configService.post(apiUrl, result.value).subscribe(
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
