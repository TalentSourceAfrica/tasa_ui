import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, CredentialsService } from '@app/auth';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  transactionConfig: any = {
    status: '',
    transaction_id: '',
    tx_ref: '',
    typeOfPurchase: '',
  };
  constructor(
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private authenticationService: AuthenticationService
  ) {
    const qParams = this.route.snapshot.queryParams;
    this.transactionConfig.status = qParams.status;
    this.transactionConfig.transaction_id = qParams.transaction_id;
    this.transactionConfig.tx_ref = qParams.tx_ref;
    this.transactionConfig.typeOfPurchase = qParams.typeOfPurchase;
  }

  ngOnInit(): void {
    this.authenticationService.updateUserData(this.user);
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
