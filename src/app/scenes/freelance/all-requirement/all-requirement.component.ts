import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CredentialsService } from '@app/auth';
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
  constructor(public sharedService: SharedService, private credentialsService: CredentialsService) {}

  pagination(event: any): any {
    this.pageSize = event.pageSize;
    if (this.reqConfig.searchText !== '') {
      this.onSearchReq(event.pageIndex + 1);
    } else {
      this.fetchAllReq(event.pageIndex + 1);
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

  onSearchReq(_pageIndex?: string) {
    let $t = this;
    if ($t.reqConfig.searchText.length >= 3) {
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('requirementSearch', {
        '{searchText}': $t.reqConfig.searchText,
        '{pageNo}': _pageIndex || 1,
        '{pageSize}': this.pageSize,
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
  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
