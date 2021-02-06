import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { CartService } from './cart.service';

// import { Flutterwave, InlinePaymentOptions, PaymentSuccessResponse } from 'flutterwave-angular-v3';

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

  publicKey = 'FLWPUBK_TEST-ce36b868ed8ed63aefaec7ebf85d0117-X';
  customerDetails = { name: 'Demo Customer  Name', email: 'customer@mail.com', phone_number: '08100000000' };
  customizations = {
    title: 'Customization Title',
    description: 'Customization Description',
    logo: 'https://flutterwave.com/images/logo-colored.svg',
  };
  meta = { counsumer_id: '7898', consumer_mac: 'kjs9s8ss7dd' };

  // paymentData: InlinePaymentOptions = {
  //   public_key: this.publicKey,
  //   tx_ref: this.generateReference(),
  //   amount: 10,
  //   currency: 'NGN',
  //   payment_options: 'card,ussd',
  //   redirect_url: '',
  //   meta: this.meta,
  //   customer: this.customerDetails,
  //   customizations: this.customizations,
  //   callback: this.makePaymentCallback,
  //   onclose: this.closedPaymentModal,
  //   callbackContext: this,
  // };

  constructor(public sharedService: SharedService, private cartService: CartService) {}

  makePayment() {
    sessionStorage.setItem('isPaymentAPI', 'true');
    let apiUrl = 'https://api.flutterwave.com/v3/payments';
    let payload = {
      tx_ref: 'hooli-tx-1920bbtytty',
      amount: '100',
      currency: 'NGN',
      redirect_url: 'https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc',
      payment_options: 'card',
      meta: {
        consumer_id: 23,
        consumer_mac: '92a3-912ba-1192a',
      },
      customer: {
        email: 'user@gmail.com',
        phonenumber: '080****4528',
        name: 'Yemi Desola',
      },
      customizations: {
        title: 'Pied Piper Payments',
        description: "Middleout isn't free. Pay the price",
        logo: 'https://assets.piedpiper.com/logo.png',
      },
    };

    this.sharedService.configService.post(apiUrl, payload).subscribe(
      (response) => {
        console.log(response);
        sessionStorage.removeItem('isPaymentAPI');
      },
      (error) => {
        console.log(error);
        sessionStorage.removeItem('isPaymentAPI');
      }
    );
    // var settings = {
    //   async: true,
    //   crossDomain: true,
    //   url: 'https://api.flutterwave.com/v3/payments',
    //   method: 'POST',
    //   headers: {
    //     authorization: 'Bearer FLWSECK_TEST-89895f07ab4316fc9858e2f9b88eca2d-X',
    //     'content-type': 'application/json',
    //     'cache-control': 'no-cache',
    //     'postman-token': '4b889e90-14a6-01e4-d195-e19db693318a',
    //     'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
    //     'Access-Control-Allow-Origin': '*',
    //     'Cache-Control': 'no-cache',
    //   },
    //   processData: false,
    //   data:
    //     '{"tx_ref":"hooli-tx-1920bbt3433","amount":"100","currency":"USD","redirect_url":"https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc","payment_options":"card","meta":{"consumer_id":23,"consumer_mac":"92a3-912ba-1192a"},"customer":{"email":"user@gmail.com","phonenumber":"080****4528","name":"Yemi Desola"},"customizations":{"title":"Pied Piper Payments","description":"Middleout isn\'t free. Pay the price","logo":"https://assets.piedpiper.com/logo.png"}}\n\n',
    // };

    // $.ajax(settings).done(function (response) {
    //   console.log(response);
    // });
  }
  // makePaymentCallback(response: PaymentSuccessResponse): void {
  //   console.log('Payment callback', response);
  // }
  // generateReference(): string {
  //   let date = new Date();
  //   return date.getTime().toString();
  // }
  // closedPaymentModal(): void {
  //   console.log('payment is closed');
  // }

  ngOnInit(): void {
    this.cartDetails = this.cartService.fetchData();
    console.log(this.cartService.fetchData());
  }
}
