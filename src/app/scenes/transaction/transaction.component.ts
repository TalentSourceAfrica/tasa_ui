import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

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
    receiptUrl: '',
  };
  constructor(
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private authenticationService: AuthenticationService,
    public sharedService: SharedService
  ) {
    const qParams = this.route.snapshot.queryParams;
    this.transactionConfig.status = qParams.status;
    this.transactionConfig.transaction_id = qParams.transaction_id;
    this.transactionConfig.tx_ref = qParams.tx_ref;
    this.transactionConfig.typeOfPurchase = qParams.typeOfPurchase;
    this.transactionConfig.receiptUrl = qParams.receipt_url ? qParams.receipt_url : '';
  }

  openReceipt() {
    this.sharedService.utilityService.openLinkInNewTab(this.transactionConfig.receiptUrl);
  }

  ngOnInit(): void {
    this.authenticationService.updateUserData(this.user);
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
