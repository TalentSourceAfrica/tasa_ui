import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { untilDestroyed } from '@app/@core';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { localStorageKeys } from '@app/models/constants';
import { SharedService } from '@app/services/shared.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-all-gigs',
  templateUrl: './all-gigs.component.html',
  styleUrls: ['./all-gigs.component.scss'],
})
export class AllGigsComponent implements OnInit {
  private currMsgSubscribe = new Subscription();
  gigConfig: any = {
    data: [],
    isLoading: false,
    gigSearchText: '',
    isSearching: false,
  };
  freelanceConfig: any = {
    isLoading: false,
    data: [],
    searchConfig: '',
    freelancerSearchText: '',
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
  constructor(
    public sharedService: SharedService,
    private credentialsService: CredentialsService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

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
        if ($t.gigConfig.data.length) {
          $t.getRatingForGigCardUsers();
        } else {
          $t.gigConfig.isLoading = false;
        }
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
          if ($t.gigConfig.data.length) {
            $t.getRatingForGigCardUsers();
          } else {
            $t.gigConfig.isLoading = false;
          }
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    }
  }

  getRatingForGigCardUsers() {
    let $t = this;
    let payload = $t.gigConfig.data.map((d: any) => d.tasaId);
    $t.gigConfig.isLoading = true;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getUsersRating');
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response: any) => {
        $t.gigConfig.data.forEach((d: any) => {
          const selGig = response.responseObj.find((gig: any) => gig.tasaId === d.tasaId);
          if (selGig) {
            d['rating'] = selGig.averageRating;
            d['ratingCount'] = selGig.countOfRating;
          }
        });
        $t.gigConfig.isLoading = false;
      },
      (error) => {
        $t.gigConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  fetchFreelancers() {
    let $t = this;
    if ($t.freelanceConfig.freelancerSearchText.length >= 3) {
      $t.freelanceConfig.isLoading = true;
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchFreelancer', {
        '{page}': 1,
        '{size}': 100,
        '{searchText}': $t.freelanceConfig.freelancerSearchText,
      });
      $t.sharedService.configService.post(apiUrl).subscribe(
        (response: any) => {
          $t.freelanceConfig.isLoading = false;
          $t.freelanceConfig.data = response.responseObj;
          $t.freelanceConfig.data.forEach((element: any) => {
            const currentExp = element.experience.find((d: any) => d.recentEmployer);
            if (currentExp) {
              element['currentJobTitle'] = `${currentExp.currentRole[0]} @ ${currentExp.organization}`;
            }
          });
        },
        (error) => {
          $t.freelanceConfig.isLoading = false;
          $t.freelanceConfig.data = [];
        }
      );
    }
  }

  viewFreelance(user: any) {
    let $t = this;
    if (!this.user) {
      if ($t.sharedService.deviceDetectorService.isMobile()) {
        $t.authenticationService.openLoginPopup();
      } else {
        $t.authenticationService.openSignupPopup('sign-in');
      }
    } else {
      $t.router.navigate(['/social-network/profile/', user.tasaId], { replaceUrl: true });
      $t.sharedService.utilityService.changeMessage('VIEW-USER-PROFILE');
    }
  }

  ngOnInit(): void {
    this.fetchUserGig(1);
    window.scrollTo(0, 0);
    this.currMsgSubscribe = this.sharedService.utilityService.currentMessage
      .pipe(delay(10), untilDestroyed(this))
      .subscribe((message) => {
        if (message === 'TRIGGER-GIG-SEARCH') {
          this.gigConfig.gigSearchText = JSON.parse(localStorage.getItem(localStorageKeys.gigSearchKey));
          this.freelanceConfig.freelancerSearchText = JSON.parse(localStorage.getItem(localStorageKeys.gigSearchKey));

          this.onSearchGig();
          this.fetchFreelancers();
          localStorage.removeItem(localStorageKeys.gigSearchKey);
        }
      });
  }

  ngOnDestroy(): void {
    this.currMsgSubscribe.unsubscribe();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
