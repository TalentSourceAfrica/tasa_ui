import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { CartService } from '../cart/cart.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss'],
})
export class SubscriptionPlansComponent implements OnInit {
  tiers: any;
  constructor(public sharedService: SharedService, private cartService: CartService, private router: Router) {}

  getTiers() {
    let apiUrl = this.sharedService.urlService.simpleApiCall('getSubscriptions');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.tiers = response.responseObj;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  subscribeNow(item: any) {
    let _callback = () => {
      this.cartService.setCartForSubscription(item);
      Swal.fire({
        title: 'Added', // title of the modal
        text: '', // description of the modal
        type: 'success', // warning, error, success, info, and question,
        backdrop: true,
        confirmButtonClass: 'rounded-pill shadow-sm',
        cancelButtonClass: 'rounded-pill shadow-sm',
        confirmButtonText: 'Go To Checkout!',
        showCancelButton: true,
      }).then((isConfirm) => {
        if (isConfirm.value) {
          Swal.close();
          this.router.navigate(['/cart']);
        } else {
          Swal.close();
        }
      });
    };
    this.sharedService.uiService.showPreConfirmPopMsg('Do You Want To Buy This Subscription', _callback);
  }

  ngOnInit(): void {
    this.getTiers();
  }
}
