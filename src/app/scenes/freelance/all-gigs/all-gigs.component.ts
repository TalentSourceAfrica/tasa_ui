import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SharedService } from '@app/services/shared.service';

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

  length = 100;
  pageSize = 20;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  constructor(public sharedService: SharedService) {}

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

  onSearchGig(_type?: string) {
    let $t = this;
    if ($t.gigConfig.gigSearchText.length >= 3) {
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('gigSearch', {
        '{searchText}': $t.gigConfig.gigSearchText,
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
}
