import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-all-gigs',
  templateUrl: './all-gigs.component.html',
  styleUrls: ['./all-gigs.component.scss'],
})
export class AllGigsComponent implements OnInit {
  gigConfig: any = {
    data: [],
    isLoading: false,
    gigSearchText: '',
    isSearching: false,
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

  length = 100;
  pageSize = 20;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  constructor(public sharedService: SharedService, private credentialsService: CredentialsService) {}

  pagination(event: any): any {
    this.pageSize = event.pageSize;
    if (this.gigConfig.gigSearchText !== '') {
      this.onSearchGig(event.pageIndex + 1);
    } else {
      this.fetchUserGig(event.pageIndex + 1);
    }
  }

  fetchUserGig(_pageIndex: number) {
    let $t = this;
    $t.gigConfig.isLoading = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getAllActiveGigs', {
      '{page}': _pageIndex,
      '{size}': $t.pageSize,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.gigConfig.data = response.responseObj;
        $t.gigConfig.isLoading = false;
      },
      (error) => {
        $t.gigConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  onSearchGig(_pageIndex?: string) {
    let $t = this;
    if ($t.gigConfig.gigSearchText.length >= 3) {
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('gigSearch', {
        '{searchText}': $t.gigConfig.gigSearchText,
        '{pageNo}': _pageIndex || 1,
        '{pageSize}': this.pageSize,
      });
      $t.sharedService.configService.get(apiUrl).subscribe(
        (response: any) => {
          $t.gigConfig.data = response.responseObj;
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    }
  }

  ngOnInit(): void {
    this.fetchUserGig(1);
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
