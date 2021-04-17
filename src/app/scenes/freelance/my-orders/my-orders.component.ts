import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit {
  orderConfig: any = {
    data: [],
    isLoading: false,
    gigSearchText: '',
    isSearching: false,
  };
  constructor(public sharedService: SharedService, private credentialsService: CredentialsService) {}

  getOrder() {
    let $t = this;
    $t.orderConfig.isLoading = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('fetchAllOrder', {
      '{tasaId}': $t.user.tasaId,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.orderConfig.data = response.responseObj.transactions;
        $t.orderConfig.isLoading = false;
      },
      (error) => {
        $t.orderConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.getOrder();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
