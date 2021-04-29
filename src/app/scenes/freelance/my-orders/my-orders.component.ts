import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { requirementProgressStatus, requirementStatus } from '@app/models/constants';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit {
  requirementStatus = JSON.parse(JSON.stringify(requirementStatus));
  requirementProgressStatus = JSON.parse(JSON.stringify(requirementProgressStatus));
  orderConfig: any = {
    data: [],
    isLoading: false,
    gigSearchText: '',
    isSearching: false,
  };

  reqProgressConfig: any = {
    percent: 0,
    color: 'primary',
    mode: 'determinate',
  };

  allAssignmentConfig: any = {
    data: [],
    isLoading: false,
  };

  allBidConfig: any = {
    data: [],
    isLoading: false,
  };

  constructor(public sharedService: SharedService, private credentialsService: CredentialsService) {
    // create Progress Percent base on stages;
    this.requirementProgressStatus.forEach((d: any, i: number) => {
      d['percent'] = ((i + 1) / this.requirementProgressStatus.length) * 100;
    });
  }

  changeReqStage(item: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Updating Stage');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('updateRequirementStage', {
      '{requirementId}': item.id,
      '{stage}': item.stage,
      '{userId}': $t.user.email,
    });
    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        if (item.stage === 'Completed') {
          item['isCompleted'] = true;
        }
        $t.sharedService.uiService.showApiSuccessPopMsg('Stage Updated');
        $t.calculateProgress(item);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  // checkReqProgress(item: any) {
  //   let $t = this;
  //   item.isLoadingProgress = true;
  //   let apiUrl = $t.sharedService.urlService.apiCallWithParams('getRequirement', {
  //     '{requirementId}': item.id,
  //   });
  //   $t.sharedService.configService.get(apiUrl).subscribe(
  //     (response: any) => {
  //       item.progressStatus = response.responseObj.stage;
  //       if (item.progressStatus === 'Completed') {
  //         item['isCompleted'] = true;
  //       }
  //       const currentProgressStage = $t.requirementProgressStatus.find((d: any) => d.value === item.progressStatus);
  //       item['reqProgressConfig'] = { ...$t.reqProgressConfig };
  //       item['reqProgressConfig'].percent = currentProgressStage.percent.toFixed(2);
  //       // disable all previous stages
  //       $t.requirementProgressStatus.forEach((d: any, i: number) => {
  //         d['disable'] = i <= currentProgressStage.id - 1 ? true : false;
  //       });

  //       item.isLoadingProgress = false;
  //     },
  //     (error) => {
  //       item.isLoadingProgress = false;
  //       $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
  //     }
  //   );
  // }

  calculateProgress(item: any) {
    let $t = this;
    const currentProgressStage = $t.requirementProgressStatus.find((rps: any) => rps.value === item.stage);
    item['completePerc'] = currentProgressStage.percent.toFixed(2);
    item['requirementProgressStatus'] = [...$t.requirementProgressStatus];
    // disable all previous stages
    item['requirementProgressStatus'].forEach((rps: any, i: number) => {
      rps['disable'] = i <= currentProgressStage.id - 1 ? true : false;
    });
  }

  paymentToFreelancer(item: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Checking Eligibility');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('prePayout', {
      '{tasaId}': item.winningTasaId,
      '{requirementId}': item.id,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.sharedService.uiService.closePopMsg();
        $t.transferMoneyToFreelancer();
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  transferMoneyToFreelancer() {
    let $t = this;
    let payload = {
      account_bank: '044',
      account_number: '0690000040',
      amount: 5500,
      narration: 'Akhlm Pstmn Trnsfr xx007',
      currency: 'NGN',
      reference: 'akhlm-pstmnpyt-rfxx007_PMCKDU_1',
      callback_url: 'https://webhook.site/b3e505b0-fe02-430e-a538-22bbbce8ce0d',
      debit_currency: 'NGN',
    };
    const apiUrl = 'https://api.flutterwave.com/v3/transfers';
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {}
    );
  }

  postTransferMoneyToFreelancer() {
    let $t = this;
    let payload = {
      id: '',
      tasaId: '',
      requirementId: '',
      externalTransactionId: '',
      amount: 0,
    };

    let apiUrl = $t.sharedService.urlService.simpleApiCall('postPayout');
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {}
    );
  }

  downloadInvoice(data: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Downloading');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('downloadInvoice', {
      '{tasaId}': $t.user.tasaId,
      '{requirementId}': data.id,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Downloading Successfull');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getOrder() {
    let $t = this;
    $t.orderConfig.isLoading = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('fetchAllOrder', {
      '{tasaId}': $t.user.tasaId,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.orderConfig.data = response.responseObj.transactions;
        $t.orderConfig.data = $t.orderConfig.data.filter((d: any) => d.type !== 'Course');
        $t.orderConfig.data.forEach((element: any) => {
          element['progressStatus'] = '';
          element['rating'] = 0;
          element['isCompleted'] = false;
        });
        $t.orderConfig.isLoading = false;
      },
      (error) => {
        $t.orderConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getAllAssignments() {
    let $t = this;
    $t.allAssignmentConfig.isLoading = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getAllAssignments', {
      '{tasaId}': $t.user.tasaId,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.allAssignmentConfig.data = response.responseObj;
        $t.allAssignmentConfig.data.forEach((d: any) => {
          $t.calculateProgress(d);
        });
        $t.allAssignmentConfig.isLoading = false;
      },
      (error) => {
        $t.orderConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getAllBids() {
    let $t = this;
    $t.allBidConfig.isLoading = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('fetchAllBidsForBidderCustomeWise', {
      '{bidderId}': $t.user.email,
      '{status}': 'All',
      '{custom}': 'Y',
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.allBidConfig.data = response.responseObj;
        $t.allBidConfig.isLoading = false;
      },
      (error) => {
        $t.orderConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    // this.getOrder();
    this.getAllAssignments();
    this.getAllBids();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
