import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { CartService } from '@app/scenes/cart/cart.service';
import { SharedService } from '@app/services/shared.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gig-view',
  templateUrl: './gig-view.component.html',
  styleUrls: ['./gig-view.component.scss'],
})
export class GigViewComponent implements OnInit {
  gigDetailsConfig: any = {
    isLoading: false,
    data: {},
    gigId: 0,
  };

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
    private route: ActivatedRoute,
    private cartService: CartService,
    private credentialsService: CredentialsService,
    private router: Router
  ) {}

  getGigDetail() {
    let $t = this;
    $t.gigDetailsConfig.gigId = $t.route.snapshot.params.gigId;
    $t.gigDetailsConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getGigCard', {
      '{gigCardId}': this.gigDetailsConfig.gigId,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.gigDetailsConfig.data = response.responseObj;
        $t.getRatingForGigCardUser();
        $t.gigDetailsConfig.isLoading = false;
      },
      (error) => {
        $t.gigDetailsConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  purchaseGig(gigPlan: any) {
    let $t = this;
    $t.sharedService.uiService.closePopMsg();
    let _callback = () => {
      $t.gigDetailsConfig.data = { ...$t.gigDetailsConfig.data, selectedGigPlan: gigPlan };
      $t.cartService.setCartForGig($t.gigDetailsConfig.data);
      Swal.fire({
        title: 'Added..!', // title of the modal
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
          $t.router.navigate(['/cart']);
        } else {
          Swal.close();
        }
      });
    };
    $t.sharedService.uiService.showPreConfirmPopMsg('Do You Want To Buy This Gig', _callback);
  }

  getRatingForGigCardUser() {
    let $t = this;
    let payload = [$t.gigDetailsConfig.data.tasaId];
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getUsersRating');
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response: any) => {
        $t.gigDetailsConfig.data['rating'] = response.responseObj[0].averageRating;
        $t.gigDetailsConfig.data['ratingCount'] = response.responseObj[0].countOfRating;
        $t.gigDetailsConfig.isLoading = false;
      },
      (error) => {
        $t.gigDetailsConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.getGigDetail();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
