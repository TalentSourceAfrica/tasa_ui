import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { OwlDOMData } from 'ngx-owl-carousel-o/lib/models/owlDOM-data.model';

// services
import { QuoteService } from './quote.service';
import { DialogService } from '@app/services/dialog.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  quote: string | undefined;
  isLoading = false;
  activeSlide: number = 3;
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
      }
    },
    nav: true,
    navSpeed: 500,
    navText: ['<i class="fa-chevron-left">Prev</i>', '<i class="fa-chevron-right">Next</i>']
  }
  constructor(private quoteService: QuoteService) {}

  ngOnInit() {
    this.isLoading = true;
    this.quoteService
      .getRandomQuote({ category: 'dev' })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((quote: string) => {
        this.quote = quote;
      });
  }

  getPassedData(data: SlidesOutputData) {
    console.log('------ slide data -------', data);
    this.activeSlide = data.startPosition;
    console.log('------- active slider -----', this.activeSlide);
  }
}
