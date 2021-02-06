import { HostListener, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartConfig: any = {};

  constructor() {
    this.setData();
  }

  setData() {
    if (localStorage.getItem('cartConfig')) {
      this.cartConfig = JSON.parse(localStorage.getItem('cartConfig'));
      localStorage.removeItem('cartConfig');
    }
  }

  intializeConfig() {
    this.cartConfig = {
      isSubscription: false,
      isCourse: false,
      subscriptionData: {},
      courseData: {},
    };
  }

  clearCart() {
    this.intializeConfig();
  }

  setCartForCourse(_data: Object) {
    this.intializeConfig();
    this.cartConfig.isCourse = true;
    this.cartConfig.courseData = _data;
  }

  setCartForSubscription(_data: Object) {
    this.intializeConfig();
    this.cartConfig.isSubscription = true;
    this.cartConfig.subscriptionData = _data;
  }

  fetchData() {
    return Object.assign(this.cartConfig);
  }
}
