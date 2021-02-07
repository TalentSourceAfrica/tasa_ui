import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  };
  constructor(private route: ActivatedRoute) {
    const qParams = this.route.snapshot.queryParams;
    this.transactionConfig.status = qParams.status;
    this.transactionConfig.transaction_id = qParams.transaction_id;
    this.transactionConfig.tx_ref = qParams.tx_ref;
  }

  ngOnInit(): void {}
}
