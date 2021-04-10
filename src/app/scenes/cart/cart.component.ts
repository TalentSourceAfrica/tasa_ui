import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { CartService } from './cart.service';
import { flutterWaveKeys, fultterWavePaymentPlansForLocal } from '@app/models/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CredentialsService } from '@app/auth';
import { Router } from '@angular/router';
import { BaseConfig } from '@app/@core/backend/baseconfig';
import { environment } from '@env/environment';
import { OwlOptions } from 'ngx-owl-carousel-o';

declare var FlutterwaveCheckout: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
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

  makePayment() {
    let $t = this;
    const customer = this.customerForm.getRawValue();
    let flutterWaveProperties = {
      public_key: flutterWaveKeys['Public Key'],
      tx_ref: $t.uuidv4Generator(),
      amount: $t.amount,
      currency: 'USD',
      country: 'US',
      payment_options:
        'account,banktransfer,payattitude,mpesa,mobilemoneyfranco,paga,card,mobilemoneyghana,ussd,credit',
      meta: {
        consumer_id: 23,
        consumer_mac: '92a3-912ba-1192a',
      },
      customer: {
        email: customer.email,
        phone_number: customer.phoneNumber,
        name: customer.name,
      },
      callback: function (data: any) {
        $t.afterPayment(data);
      },
      onclose: function () {
        // close modal
      },
      customizations: {
        title: 'TaSA',
        description: 'Payment for items in cart',
        logo: 'https://assets.tasainc.com/images/TaSALogo.jpg',
      },
    };
    if ($t.cartDetails.isSubscription) {
      flutterWaveProperties = { ...flutterWaveProperties, amount: $t.amount };
      flutterWaveProperties['payment_plan'] = 10028;
    }
    FlutterwaveCheckout(flutterWaveProperties);
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
    this.loadScript('https://checkout.flutterwave.com/v3.js');
    this.cartDetails = this.cartService.fetchData();
    console.log(this.cartDetails);
    if (this.cartDetails.isSubscription) {
      this.amount = this.cartDetails.subscriptionData.price;
    } else if (this.cartDetails.isCourse) {
      this.amount = this.cartDetails.courseData.offerPrice;
    } else if (this.cartDetails.isGig) {
      this.amount = this.cartDetails.gigData.price;
    } else if (this.cartDetails.isCustomGig) {
      this.amount = this.cartDetails.customGigData.bidderDetails.cost;
    }
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
