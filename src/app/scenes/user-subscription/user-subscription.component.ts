import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-user-subscription',
  templateUrl: './user-subscription.component.html',
  styleUrls: ['./user-subscription.component.scss'],
})
export class UserSubscriptionComponent implements OnInit {
  mySubscription: any;
  isLoading: boolean = true;
  constructor(private credentialsService: CredentialsService, public sharedService: SharedService) {}

  getPlanDetails() {
    let $t = this;
    $t.isLoading = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getSubscriptionById', {
      '{subsId}': $t.mySubscription.subscriptionId,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.mySubscription['subscriptionData'] = response.responseObj;
        $t.isLoading = false;
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        $t.isLoading = false;
      }
    );
  }
  ngOnInit(): void {
    this.mySubscription = this.user.currentSubscription;
    this.getPlanDetails();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
