import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { OwlDOMData } from 'ngx-owl-carousel-o/lib/models/owlDOM-data.model';

// services
import { QuoteService } from './quote.service';
import { DialogService } from '@app/services/dialog.service';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  activeSlide: number = 3;
  news: Array<object> = [];
  posts: Array<object> = [];
  customOptions: OwlOptions = {
    loop: true,
    animateIn: 'slide-in',
    animateOut: 'slide-out',
    autoplay: true,
    autoplaySpeed: 5000,
    autoplayHoverPause: false,
    autoplayTimeout: 5000,
    center: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
    nav: true,
    navSpeed: 500,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
  };

  customOption2: OwlOptions = {
    animateOut: true,
    animateIn: true,
    nav: true,
    loop: true,
    navText: ['<i class="fa fa-chevron-left"></i>', '<i class="fa fa-chevron-right"></i>'],
    dots: false,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: {
      0: {
        items: 1,
      },
      750: {
        items: 2,
      },
    },
  };
  constructor(private sharedService: SharedService) {}

  getNews() {
    let apiUrl = this.sharedService.urlService.simpleApiCall('getNews');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.news = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPosts() {
    let apiUrl = this.sharedService.urlService.simpleApiCall('gePost');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.posts = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
    this.isLoading = true;
    this.getPosts();
    this.getNews();
  }

  getPassedData(data: SlidesOutputData) {
    console.log('------ slide data -------', data);
    this.activeSlide = data.startPosition;
    console.log('------- active slider -----', this.activeSlide);
  }
}
