import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-group-view-popup',
  templateUrl: './group-view-popup.component.html',
  styleUrls: ['./group-view-popup.component.scss'],
})
export class GroupViewPopupComponent implements OnInit {
  popupData: any;
  groupDetailsConfig: any = {
    isLoading: false,
    data: {},
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<GroupViewPopupComponent>,
    public sharedService: SharedService,
    private router: Router
  ) {
    this.popupData = data;
  }

  showProfile(tasaId: string) {
    this.router.navigate(['/social-network/profile/', tasaId], { replaceUrl: true });
  }

  getGroupDetails() {
    this.groupDetailsConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getGroupInfo', {
      '{groupId}': this.popupData.group.groupId,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.groupDetailsConfig.data = response.responseObj;
        this.groupDetailsConfig.isLoading = false;
      },
      (error) => {
        this.groupDetailsConfig.isLoading = false;
        this.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.getGroupDetails();
  }
}
