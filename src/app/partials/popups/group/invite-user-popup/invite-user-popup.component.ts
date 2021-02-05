import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SocialnetworkService } from '@app/scenes/social-network/socialnetwork.service';
import { SharedService } from '@app/services/shared.service';

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
    this.sharedService.uiService.showApiStartPopMsg('Inviting User...');
    let apiUrl = this.sharedService.urlService.apiCallWithParams('sendRequestToPeople', {
      '{adminId}': this.popupData.user.email,
      '{userId}': this.selectedUser.email,
      '{groupId}': this.popupData.group.groupId,
    });
    this.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        this.sharedService.uiService.showApiSuccessPopMsg(response.message);
        this.dialogRef.close();
      },
      (error) => {
        this.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.getAllusers();
  }
}
