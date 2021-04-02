import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-all-requirement',
  templateUrl: './all-requirement.component.html',
  styleUrls: ['./all-requirement.component.scss'],
})
export class AllRequirementComponent implements OnInit {
  reqConfig: any = {
    data: [],
    isLoading: false,
    searchText: '',
    isSearching: false,
  };
  length = 100;
  pageSize = 20;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  constructor(public sharedService: SharedService) {}

  pagination(event: any): any {
    this.pageSize = event.pageSize;
    if (this.reqConfig.searchText !== '') {
      this.onSearchGig(event.pageIndex + 1);
    } else {
      this.fetchAllReq(event.pageIndex + 1);
    }
  }

  onSearchReq() {
    let $t = this;
    if ($t.reqConfig.searchText.length >= 3) {
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('gigSearch', {
        '{searchText}': $t.reqConfig.searchText,
      });
      $t.sharedService.configService.get(apiUrl).subscribe(
        (response: any) => {
          $t.reqConfig.data = response.responseObj;
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    }
  }

  fetchAllReq(_pageIndex: number) {
    let $t = this;
    $t.reqConfig.isLoading = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getAllOpenRequirement', {
      '{page}': _pageIndex,
      '{size}': $t.pageSize,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.reqConfig.data = response.responseObj;
        $t.reqConfig.isLoading = false;
      },
      (error) => {
        $t.reqConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  onSearchGig(_type?: string) {
    let $t = this;
    if ($t.reqConfig.searchText.length >= 3) {
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('gigSearch', {
        '{searchText}': $t.reqConfig.searchText,
      });
      $t.sharedService.configService.get(apiUrl).subscribe(
        (response: any) => {
          $t.reqConfig.data = response.responseObj;
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    }
  }

  ngOnInit(): void {
    this.fetchAllReq(1);
  }
}
