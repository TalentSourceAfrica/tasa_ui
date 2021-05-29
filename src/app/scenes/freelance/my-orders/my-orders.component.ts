import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { requirementProgressStatus, requirementStatus, stripeKeys } from '@app/models/constants';
import { SubmitFeedbackPopupComponent } from '@app/partials/popups/freelance/submit-feedback-popup/submit-feedback-popup.component';
import { BaseConfig } from '@app/@core/backend/baseconfig';

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

  baseConfig = new BaseConfig();
  stripeKey: string = '';
  handler: any = null;

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
    const _requirementProgressStatus = JSON.parse(JSON.stringify($t.requirementProgressStatus));
    item['requirementProgressStatus'] = _requirementProgressStatus;
    const currentProgressStage = _requirementProgressStatus.find((rps: any) => rps.value === item.stage);
    item['completePerc'] = currentProgressStage.percent.toFixed(2);
    // disable all previous stages
    item['requirementProgressStatus'].forEach((rps: any, i: number) => {
      rps['disable'] = i <= currentProgressStage.id - 1 ? true : false;
    });
    // set if work is completed
    if (currentProgressStage.value === 'Completed') {
      item['isCompleted'] = true;
    }
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
        $t.makePayment(item);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  transferMoneyToFreelancer(_stripeData: any, _assignmentData: any) {
    console.log(_assignmentData);
    let $t = this;
    let apiUrl: any;

    let payload = {
      description: 'Payment for freelancer',
      amount: 0,
      price: _assignmentData.transactionPrice,
      currency: 'USD',
      stripeEmail: _stripeData.email,
      stripeToken: _stripeData.id,
      stripePlanId: '',
      tier: '',
      tasaId: $t.user.tasaId,
      bidId: '',
      courseId: '',
      gigId: _assignmentData.id,
      freelancerEnrolled: 'N',
      payout: 'Y',
    };

    apiUrl = $t.sharedService.urlService.simpleApiCall('createPayment');
    $t.sharedService.uiService.showApiStartPopMsg('Processing');
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response: any) => {
        $t.postTransferMoneyToFreelancer(_assignmentData);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  postTransferMoneyToFreelancer(_assignmentData: any) {
    let $t = this;
    let payload = {
      id: '',
      tasaId: _assignmentData.winningTasaId,
      requirementId: _assignmentData.id,
      externalTransactionId: '',
      amount: _assignmentData.transactionPrice,
    };

    let apiUrl = $t.sharedService.urlService.simpleApiCall('postPayout');
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response) => {
        console.log(response);
        _assignmentData.sellerInvoiceGenerated = 'Y';
        $t.sharedService.uiService.showApiSuccessPopMsg('Amount transferred successfully.');
      },
      (error) => {}
    );
  }

  openFeedbackPopup(data: any) {
    let buyerDetails: any = {
      email: data.postedBy,
      name: data.postedByName,
      tasaId: data.postedByTasaId,
      userImage: data.postedByImage,
    };
    let freelancerDetails: any = {
      email: data.winningUserId,
    };
    let reqDetails: any = {
      requirementId: data.id,
      requirementCategory: data.category,
    };
    this.sharedService.dialogService.open(SubmitFeedbackPopupComponent, {
      width: '700px',
      data: {
        buyerDetails: buyerDetails,
        user: freelancerDetails,
        reqDetails: reqDetails,
      },
      disableClose: false,
    });
  }

  checkShowDownloadInvoice(data: any) {
    if (data.postedByTasaId == this.user.tasaId) {
      return true;
    } else {
      if (data.winningTasaId == this.user.tasaId && data.isCompleted && data.sellerInvoiceGenerated === 'Y') {
        return true;
      } else {
        return false;
      }
    }
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
        // saveAs(new Blob([response]), 'invoice.pdf');
        $t.sharedService.utilityService.downloadURI(apiUrl);
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

  loadStripe() {
    let $t = this;
    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement('script');
      s.id = 'stripe-script';
      s.type = 'text/javascript';
      s.src = 'https://checkout.stripe.com/checkout.js';
      s.onload = () => {
        this.handler = (<any>window).StripeCheckout.configure({
          key: $t.stripeKey,
          locale: 'auto',
          token: function (token: any) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
          },
        });
      };

      window.document.body.appendChild(s);
    }
  }

  makePayment(assignmentData: any) {
    let $t = this;
    var handler = (<any>window).StripeCheckout.configure({
      key: $t.stripeKey,
      locale: 'auto',
      token: function (stripeData: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        $t.transferMoneyToFreelancer(stripeData, assignmentData);
      },
    });

    handler.open({
      name: 'TaSA',
      label: 'Checkout',
      description: 'Transfer amount to your account',
      image: 'https://s3.amazonaws.com/content.common/TaSALogo.jpg',
      amount: assignmentData.transactionPrice * 100,
    });
  }

  ngOnInit(): void {
    // change stripe key according to environment
    if (this.baseConfig.env === 'PROD') {
      this.stripeKey = stripeKeys.secret;
    } else {
      this.stripeKey = stripeKeys.public;
    }
    this.getAllAssignments();
    this.getAllBids();
    this.loadStripe();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
