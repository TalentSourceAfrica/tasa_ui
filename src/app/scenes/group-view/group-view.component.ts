import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.scss'],
})
export class GroupViewComponent implements OnInit {
  groupDetailsConfig: any = {
    isLoading: false,
    data: {},
    groupId: 0,
    isCurrentUserAlreadyAMember: false,
  };
  constructor(
    public sharedService: SharedService,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService
  ) {}

  getGroupDetail() {
    let $t = this;
    $t.groupDetailsConfig.groupId = $t.route.snapshot.params.groupId;
    $t.groupDetailsConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getGroupInfo', {
      '{groupId}': this.groupDetailsConfig.groupId,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.groupDetailsConfig.data = response.responseObj;
        if (this.groupDetailsConfig.data.members.filter((d: any) => d.email === this.user.email).length) {
          this.groupDetailsConfig.isCurrentUserAlreadyAMember = true;
        } else {
          this.groupDetailsConfig.isCurrentUserAlreadyAMember = false;
        }
        this.groupDetailsConfig.isLoading = false;
      },
      (error) => {
        this.groupDetailsConfig.isLoading = false;
        this.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  sendRequest(grpId: any) {
    Swal.fire({
      title: 'Add A Note',
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
          this.sharedService.uiService.showApiStartPopMsg('Sending Request to Admin...');
          let apiUrl = this.sharedService.urlService.apiCallWithParams('sendRequestToGroup', {
            '{userId}': this.user.email,
            '{groupId}': grpId,
          });
          this.sharedService.configService.post(apiUrl, result.value).subscribe(
            (response: any) => {
              this.sharedService.uiService.showApiSuccessPopMsg('Request Send.');
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
    this.getGroupDetail();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
