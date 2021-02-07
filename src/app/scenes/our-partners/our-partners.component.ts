import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';

import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-our-partners',
  templateUrl: './our-partners.component.html',
  styleUrls: ['./our-partners.component.scss'],
})
export class OurPartnersComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    smartSpeed: 1000,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    autoplayHoverPause: true,
    nav: true,
    navText: ["<i class='fas fa-3x fa-chevron-circle-left'></i>", "<i class='fas fa-3x fa-chevron-circle-right'></i>"],
    autoplayTimeout: 3000,
    responsive: {
      0: {
        items: 1,
      },
      300: {
        items: 2,
      },
      600: {
        items: 3,
      },
    },
  };
  partners = ['client-1.png', 'client-2.png', 'client-3.png', 'client-4.png', 'client-5.png', 'client-6.png'];
  constructor(public sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.utilityService.requiredStyleForHomeHeader();
    window.scrollTo(0, 0);
  }
}
