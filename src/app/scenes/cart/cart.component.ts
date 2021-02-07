import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { CartService } from './cart.service';
import { flutterWaveKeys } from '@app/models/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CredentialsService } from '@app/auth';
declare var FlutterwaveCheckout: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  public products = [
    {
      image: 'https://via.placeholder.com/200x150',
      name: 'PRODUCT ITEM NUMBER 1',
      description: 'Description for product item number 1',
      price: 5.99,
      quantity: 2,
    },
    {
      image: 'https://via.placeholder.com/200x150',
      name: 'PRODUCT ITEM NUMBER 2',
      description: 'Description for product item number 1',
      price: 9.99,
      quantity: 1,
    },
    {
      image: 'https://via.placeholder.com/200x150',
      name: 'PRODUCT ITEM NUMBER 2',
      description: 'Description for product item number 1',
      price: 9.99,
      quantity: 1,
    },
  ];

  cartDetails: any;
  amount: number = 0;
  customerForm: FormGroup;
  constructor(
    public sharedService: SharedService,
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService
  ) {}

  private createForm() {
    this.customerForm = this.formBuilder.group({
      email: [this.user.email, [Validators.required, Validators.email]],
      name: [this.user.firstName + ' ' + this.user.lastName, Validators.required],
      phoneNumber: [this.user.contactNo ? this.user.contactNo : '', Validators.required],
    });
  }

  makePayment() {
    let $t = this;
    const customer = this.customerForm.getRawValue();
    FlutterwaveCheckout({
      public_key: flutterWaveKeys['Public Key'],
      tx_ref: this.uuidv4Generator(),
      amount: this.amount,
      currency: 'USD',
      country: 'US',
      payment_options: 'card, mobilemoneyghana, ussd',
      // specified redirect URL
      redirect_url: location.origin.concat('/#/transaction'),
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
        console.log(data);
        $t.cartService.clearCart();
      },
      onclose: function () {
        // close modal
      },
      customizations: {
        title: 'TaSA',
        description: 'Payment for items in cart',
        logo: 'https://assets.piedpiper.com/logo.png',
      },
    });
  }

  uuidv4Generator() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
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
    this.createForm();
    this.loadScript('https://checkout.flutterwave.com/v3.js');
    this.cartDetails = this.cartService.fetchData();
    if (this.cartDetails.isSubscription) {
      this.amount = this.cartDetails.subscriptionData.price;
    } else if (this.cartDetails.isCourse) {
      this.amount = this.cartDetails.courseData.offerPrice;
    }
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
