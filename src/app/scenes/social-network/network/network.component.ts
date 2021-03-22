import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
})
export class NetworkComponent implements OnInit {
  networkConfig: any = {
    isLoading: false,
    data: [],
  };
  connectedUserConfig: any = {
    isLoading: false,
    data: [],
  };
  public searchedName: string = '';
  constructor(
    public sharedService: SharedService,
    public credentialsService: CredentialsService,
    private router: Router
  ) {}

  getAllConnections() {
    this.connectedUserConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getAllNetworkConnections', {
      '{userId}': this.user.email,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.connectedUserConfig.data = response;
        this.connectedUserConfig.isLoading = false;
      },
      (error) => {}
    );
  }

  message(id: string) {
    this.router.navigate(['/social-network/conversation/'], { replaceUrl: true, queryParams: { userId: id } });
  }

  getConnectionRequest() {
    let $t = this;
    $t.networkConfig.isLoading = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getAllNetworkPendingConnections', {
      '{userId}': $t.user.email,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.networkConfig.isLoading = false;
        $t.networkConfig.data = response.responseObj;
      },
      (error) => {
        $t.networkConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  approve(_id: string, index: number) {
    let $t = this;
    let _callBack = () => {
      $t.sharedService.uiService.showApiStartPopMsg('Please wait while you are added...!');
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('approveNetworkConnection', {
        '{requestId}': _id,
      });
      $t.sharedService.configService.post(apiUrl).subscribe(
        (response: any) => {
          $t.networkConfig.data.splice(index, 1);
          $t.sharedService.uiService.showApiSuccessPopMsg('Added...!');
          $t.getConnectionRequest();
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    };
    $t.sharedService.uiService.showPreConfirmPopMsg('Are you sure you want to Join?', _callBack);
  }

  reject(_id: string, index: number) {
    let $t = this;
    let _callBack = () => {
      $t.sharedService.uiService.showApiStartPopMsg('Please wait while we reject your request...!');
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('rejectNetworkConnection', {
        '{requestId}': _id,
      });
      $t.sharedService.configService.post(apiUrl).subscribe(
        (response: any) => {
          $t.networkConfig.data.splice(index, 1);
          $t.sharedService.uiService.showApiSuccessPopMsg('Rejected...!');
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    };
    $t.sharedService.uiService.showPreConfirmPopMsg('Do You Want To Reject', _callBack);
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    this.getConnectionRequest();
    this.getAllConnections();
  }
}
