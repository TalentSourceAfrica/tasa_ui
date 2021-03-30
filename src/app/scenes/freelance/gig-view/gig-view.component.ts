import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/services/shared.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

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

  constructor(public sharedService: SharedService, private route: ActivatedRoute) {}

  getGigDetail() {
    let $t = this;
    $t.gigDetailsConfig.gigId = $t.route.snapshot.params.gigId;
    $t.gigDetailsConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getGigCard', {
      '{gigCardId}': this.gigDetailsConfig.gigId,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.gigDetailsConfig.data = response.responseObj;
        this.gigDetailsConfig.isLoading = false;
      },
      (error) => {
        this.gigDetailsConfig.isLoading = false;
        this.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.getGigDetail();
  }
}
