import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  makePayment() {
  //   FlutterwaveCheckout({
  //     public_key: 'FLWPUBK_TEST-SANDBOXDEMOKEY-X',
  //     tx_ref: 'hooli-tx-1920bbtyt',
  //     amount: 54600,
  //     currency: 'NGN',
  //     country: 'NG',
  //     payment_options: 'card, mobilemoneyghana, ussd',
  //     // specified redirect URL
  //     redirect_url: 'https://callbacks.piedpiper.com/flutterwave.aspx?ismobile=34',
  //     meta: {
  //       consumer_id: 23,
  //       consumer_mac: '92a3-912ba-1192a',
  //     },
  //     customer: {
  //       email: 'user@gmail.com',
  //       phone_number: '08102909304',
  //       name: 'yemi desola',
  //     },
  //     callback: function (data:any) {
  //       console.log(data);
  //     },
  //     onclose: function () {
  //       // close modal
  //     },
  //     customizations: {
  //       title: 'My store',
  //       description: 'Payment for items in cart',
  //       logo: 'https://assets.piedpiper.com/logo.png',
  //     },
  //   });
  }

  ngOnInit(): void {}
}
