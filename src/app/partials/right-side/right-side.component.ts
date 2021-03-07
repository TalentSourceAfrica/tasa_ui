import { Component, OnInit } from '@angular/core';
import { untilDestroyed } from '@app/@core';
import { CredentialsService } from '@app/auth';
import { SocialnetworkService } from '@app/scenes/social-network/socialnetwork.service';
import { SharedService } from '@app/services/shared.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-right-side',
  templateUrl: './right-side.component.html',
  styleUrls: ['./right-side.component.scss'],
})
export class RightSideComponent implements OnInit {
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
        this.connectedUserConfig.data = response.connections ? response.connections : [];
        this.connectedUserConfig.data = [
          ...this.connectedUserConfig.data,
          ...this.connectedUserConfig.data,
          ...this.connectedUserConfig.data,
          ...this.connectedUserConfig.data,
          ...this.connectedUserConfig.data,
          ...this.connectedUserConfig.data,
          ...this.connectedUserConfig.data,
          ...this.connectedUserConfig.data,
        ];
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

  ngOnInit(): void {
    // this.getNews();
    this.getAllConnections();
    this.fetchMygroup();
  }

  ngOnDestroy(): void {}

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
