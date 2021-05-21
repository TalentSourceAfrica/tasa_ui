import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { CartService } from './cart.service';
import { flutterWaveKeys, fultterWavePaymentPlansForLocal, stripeKeys } from '@app/models/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CredentialsService } from '@app/auth';
import { Router } from '@angular/router';
import { BaseConfig } from '@app/@core/backend/baseconfig';
import { environment } from '@env/environment';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  handler: any = null;
  cartDetails: any;
  amount: number = 0;
  baseConfig: any = BaseConfig;
  customerForm: FormGroup;
  gigAssetsOptions: OwlOptions = {
    loop: true,
    autoplay: false,
    center: true,
    smartSpeed: 1000,
    dots: false,
    autoHeight: false,
    autoWidth: false,
    autoplayHoverPause: true,
    items: 1,
    nav: true,
    margin: 4,
    navText: ["<i class='fas fa-chevron-circle-left'></i>", "<i class='fas fa-chevron-circle-right'></i>"],
    autoplayTimeout: 3000,
    responsive: {
      0: {
        items: 1,
      },
    },
  };
  
  constructor(
    public sharedService: SharedService,
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private router: Router
  ) {}

  private createForm() {
    this.customerForm = this.formBuilder.group({
      email: [{ value: this.user.email, disabled: true }, [Validators.required, Validators.email]],
      name: [{ value: this.user.firstName + ' ' + this.user.lastName, disabled: true }, Validators.required],
      phoneNumber: [this.user.contactNo ? this.user.contactNo : '', Validators.required],
    });
  }

  pay(amount: any) {

    var handler = (<any>window).StripeCheckout.configure({
      key: stripeKeys.public,
      locale: 'auto',
      token: function (token: any) {
        // You can access the token ID with `token.id`.
        // Get the token ID to your server-side code for use.
        console.log(token);
        alert('Token Created!!');
      }
    });

    handler.open({
      name: 'TaSA',
      label: 'Checkout',
      description: 'Payment for items in cart',
      image : 'https://s3.amazonaws.com/content.common/TaSALogo.jpg',
      amount: amount * 100,
    });
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
          key: stripeKeys.public,
          locale: 'auto',
          token: function (token: any) {
            // You can access the token ID with `token.id`.
            // Get the token ID to your server-side code for use.
            console.log(token);
            const data = {
              transaction_id: token.id,
              status: 'successful',
              amount: $t.amount,
            };
            $t.afterPayment(data);
          },
        });
      };

      window.document.body.appendChild(s);
    }
  }

  makePayment() {
    let $t = this;
    const customer = this.customerForm.getRawValue();
    // let flutterWaveProperties = {
    //   public_key: flutterWaveKeys['Public Key'],
    //   tx_ref: $t.uuidv4Generator(),
    //   amount: $t.amount,
    //   currency: 'USD',
    //   country: 'US',
    //   payment_options:
    //     'account,banktransfer,payattitude,mpesa,mobilemoneyfranco,paga,card,mobilemoneyghana,ussd,credit',
    //   meta: {
    //     consumer_id: 23,
    //     consumer_mac: '92a3-912ba-1192a',
    //   },
    //   customer: {
    //     email: customer.email,
    //     phone_number: customer.phoneNumber,
    //     name: customer.name,
    //   },
    //   callback: function (data: any) {
    //     $t.afterPayment(data);
    //   },
    //   onclose: function () {
    //     // close modal
    //   },
    //   customizations: {
    //     title: 'TaSA',
    //     description: 'Payment for items in cart',
    //     logo: 'https://s3.amazonaws.com/content.common/TaSALogo.jpg',
    //   },
    // };
    // if ($t.cartDetails.isSubscription) {
    //   flutterWaveProperties = { ...flutterWaveProperties, amount: $t.amount };
    //   flutterWaveProperties['payment_plan'] = 10028;
    // }
    // FlutterwaveCheckout(flutterWaveProperties);
    const data = {
      transaction_id: $t.uuidv4Generator(),
      status: 'successful',
      amount: $t.amount,
    };
    $t.pay($t.amount);
    // $t.afterPayment(data);
  }

  uuidv4Generator() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  afterPayment(_data: any) {
    let $t = this;
    if ($t.cartDetails.isCourse || $t.cartDetails.isSubscription) {
      $t.afterPaymentCallForCourseAndSubs(_data);
    }
    if ($t.cartDetails.isGig) {
      $t.afterPaymentCallForGigCard(_data);
    }
    if ($t.cartDetails.isCustomGig) {
      $t.afterPaymentCallForReq(_data);
    }
  }

  afterPaymentCallForCourseAndSubs(_data: any) {
    let $t = this;
    let apiUrl: any;
    let payload = {
      transactionId: _data.transaction_id,
      transactionStatus: _data.status,
      transactionAmount: _data.amount,
      transactionOn: '',
      type: '',
      subscriptionId: '',
      courseId: '',
    };
    if ($t.cartDetails.isCourse) {
      apiUrl = $t.sharedService.urlService.apiCallWithParams('buyCourse', {
        '{tasaId}': $t.user.tasaId,
        '{courseId}': $t.cartDetails.courseData.key,
      });
    } else if ($t.cartDetails.isSubscription) {
      apiUrl = $t.sharedService.urlService.apiCallWithParams('subscribeForTier', {
        '{tasaId}': $t.user.tasaId,
        '{subscriptionId}': $t.cartDetails.subscriptionData.id,
      });
    }
    $t.sharedService.uiService.showApiStartPopMsg('Processing...');
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response: any) => {
        $t.cartService.clearCart();
        $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
        setTimeout(() => {
          $t.sharedService.uiService.closePopMsg();
          $t.router.navigate(['/transaction'], {
            queryParams: {
              status: _data.status,
              transaction_id: _data.transaction_id,
              tx_ref: _data.tx_ref,
              typeOfPurchase: $t.cartDetails.isSubscription ? 'subscription' : 'course',
            },
          });
        }, 200);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  afterPaymentCallForGigCard(_data: any) {
    let $t = this;
    let apiUrl: any;
    let payload = {
      transactionId: _data.transaction_id,
      transactionStatus: _data.status,
      transactionAmount: _data.amount,
      transactionPrice: $t.cartDetails.gigData.selectedGigPlan.price,
      description: '',
      transactionOn: '',
      buyerId: '',
      sellerId: '',
      type: '',
      subscriptionId: '',
      courseId: '',
      requirementId: '',
      bidId: '',
      gigCardId: '',
    };
    apiUrl = $t.sharedService.urlService.apiCallWithParams('checkoutGigCard', {
      '{tasaId}': $t.user.tasaId,
      '{gigCardId}': $t.cartDetails.gigData.id,
      '{gigCardPlan}': $t.cartDetails.gigData.selectedGigPlan.name.trim(),
    });
    $t.sharedService.uiService.showApiStartPopMsg('Processing');
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response: any) => {
        $t.cartService.clearCart();
        $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
        setTimeout(() => {
          $t.sharedService.uiService.closePopMsg();
          $t.router.navigate(['/transaction'], {
            queryParams: {
              status: _data.status,
              transaction_id: _data.transaction_id,
              tx_ref: _data.tx_ref,
              typeOfPurchase: 'gigcard',
            },
          });
        }, 200);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  afterPaymentCallForReq(_data: any) {
    let $t = this;
    let apiUrl: any;
    let payload = {
      transactionId: _data.transaction_id,
      transactionStatus: _data.status,
      transactionAmount: _data.amount,
      transactionPrice: $t.cartDetails.customGigData.bidderDetails.cost,
      description: '',
      transactionOn: '',
      buyerId: '',
      sellerId: '',
      type: '',
      subscriptionId: '',
      courseId: '',
      requirementId: '',
      bidId: '',
      gigCardId: '',
    };

    $t.sharedService.uiService.showApiStartPopMsg('Processing');

    apiUrl = $t.sharedService.urlService.apiCallWithParams('checkoutRequirement', {
      '{tasaId}': $t.user.tasaId,
      '{bidId}': $t.cartDetails.customGigData.bidderDetails.id,
    });

    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response: any) => {
        $t.cartService.clearCart();
        $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
        setTimeout(() => {
          $t.sharedService.uiService.closePopMsg();
          $t.router.navigate(['/transaction'], {
            queryParams: {
              status: _data.status,
              transaction_id: _data.transaction_id,
              tx_ref: _data.tx_ref,
              typeOfPurchase: 'gigcard',
            },
          });
        }, 200);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    console.log('PROD: ' + environment.production);
    this.createForm();
    // this.loadScript('https://js.stripe.com/v3/');
    this.loadStripe();
    this.cartDetails = this.cartService.fetchData();
    // console.log(this.cartDetails);
    if (this.cartDetails.isSubscription) {
      this.amount = this.cartDetails.subscriptionData.price;
    } else if (this.cartDetails.isCourse) {
      this.amount = this.cartDetails.courseData.offerPrice;
    } else if (this.cartDetails.isGig) {
      this.amount = this.cartDetails.gigData.selectedGigPlan.deliveryPrice;
    } else if (this.cartDetails.isCustomGig) {
      this.amount = this.cartDetails.customGigData.bidderDetails.deliveryPrice;
    }
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
