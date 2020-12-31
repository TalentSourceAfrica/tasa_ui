import { Component, OnInit } from '@angular/core';
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
  constructor(public sharedService: SharedService, public credentialsService: CredentialsService) {}


  getAllConnections() {
    this.connectedUserConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getAllNetworkConnections', {
      '{userId}': this.user.email,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.connectedUserConfig.data = response.connections;
        this.connectedUserConfig.isLoading = false;
      },
      (error) => {}
    );
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
        $t.networkConfig.data = response;
      },
      (error) => {
        $t.networkConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  approve() {}

  reject() {}

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    this.getConnectionRequest();
    this.getAllConnections();
  }
}
