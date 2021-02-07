import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth';

@Component({
  selector: 'app-user-subscription',
  templateUrl: './user-subscription.component.html',
  styleUrls: ['./user-subscription.component.scss'],
})
export class UserSubscriptionComponent implements OnInit {
  mySubscription: any;
  constructor(private credentialsService: CredentialsService) {}

  ngOnInit(): void {
    this.mySubscription = this.user.currentSubscription;
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
