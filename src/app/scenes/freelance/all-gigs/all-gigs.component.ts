import { Component, OnInit } from '@angular/core';
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
  constructor(public sharedService: SharedService) {}

  fetchUserGig() {
    let $t = this;
    $t.gigConfig.isLoading = true;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getAllActiveGigs');
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
    this.fetchUserGig();
  }
}
