import { Component, OnInit } from '@angular/core';
import { untilDestroyed } from '@app/@core';
import { CredentialsService } from '@app/auth';
import { SocialnetworkService } from '@app/scenes/social-network/socialnetwork.service';
import { SharedService } from '@app/services/shared.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-right-side',
  templateUrl: './right-side.component.html',
  styleUrls: ['./right-side.component.scss'],
})
export class RightSideComponent implements OnInit {
  // customOptions: OwlOptions = {
  //   loop: true,
  //   mouseDrag: false,
  //   touchDrag: false,
  //   pullDrag: false,
  //   dots: true,
  //   navSpeed: 700,
  //   items: 3,
  //   margin: 1,
  //   autoWidth: true,
  //   navText: ['', ''],
  //   nav: true,
  // };

  groupsOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    smartSpeed: 1000,
    dots: false,
    autoHeight: false,
    autoWidth: true,
    autoplayHoverPause: true,
    items: 4,
    nav: true,
    margin: 4,
    navText: ["<i class='fas fa-chevron-circle-left'></i>", "<i class='fas fa-chevron-circle-right'></i>"],
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
      900: {
        items: 4,
      },
    },
  };
  newsConfig: any = {
    isFetching: false,
    data: [],
  };
  connectedUserConfig: any = {
    isFetching: false,
    data: [],
  };

  myGroups: any = {
    data: [],
    isFetching: false,
  };
  recommendedGroupsConfig: any = {
    isFetching: false,
    data: [],
  };

  constructor(
    public sharedService: SharedService,
    private credentialsService: CredentialsService,
    private socialnetworkService: SocialnetworkService
  ) {}

  getNews() {
    this.newsConfig.isFetching = true;
    let apiUrl = this.sharedService.urlService.simpleApiCall('getNews');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.newsConfig.data = response;
        this.newsConfig.isFetching = false;
      },
      (error) => {
        this.newsConfig.isFetching = false;
      }
    );
  }

  getAllConnections() {
    this.connectedUserConfig.isFetching = true;
    this.socialnetworkService.getAllConnections().subscribe(
      (response: any) => {
        this.connectedUserConfig.data = response;
        this.connectedUserConfig.isFetching = false;
      },
      (error) => {
        this.connectedUserConfig.data = [];
        this.connectedUserConfig.isFetching = false;
      }
    );
  }

  fetchMygroup() {
    this.myGroups.isFetching = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getAllActiveGroupByUser', {
      '{userId}': this.user.email,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.myGroups.data = response.responseObj ? response.responseObj : [];
        this.myGroups.isFetching = false;
      },
      (error) => {
        this.myGroups.isFetching = false;
      }
    );
  }

  getRecommendedGroups() {
    this.recommendedGroupsConfig.isFetching = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getRecommendedGroups', {
      '{userId}': this.user.email,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.recommendedGroupsConfig.data = response.responseObj ? response.responseObj : [];
        this.recommendedGroupsConfig.data = [
          ...this.recommendedGroupsConfig.data,
          ...this.recommendedGroupsConfig.data,
          ...this.recommendedGroupsConfig.data,
          ...this.recommendedGroupsConfig.data,
          ...this.recommendedGroupsConfig.data,
          ...this.recommendedGroupsConfig.data,
          ...this.recommendedGroupsConfig.data,
          ...this.recommendedGroupsConfig.data,
        ];
        this.recommendedGroupsConfig.isFetching = false;
      },
      (error) => {
        this.recommendedGroupsConfig.isFetching = false;
      }
    );
  }

  userFetch() {
    this.sharedService.utilityService.changeMessage('FETCH-USER-PROFILE');
  }

  ngOnInit(): void {
    // this.getNews();
    if (this.user) {
      this.getAllConnections();
      this.fetchMygroup();
      this.getRecommendedGroups();
    }
  }

  ngOnDestroy(): void {}

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
