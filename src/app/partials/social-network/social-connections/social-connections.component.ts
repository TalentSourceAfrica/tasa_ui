import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-social-connections',
  templateUrl: './social-connections.component.html',
  styleUrls: ['./social-connections.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SocialConnectionsComponent implements OnInit {
  allUsers: any = [];
  isLoading: boolean = true;
  connectedUserConfig: any = {
    isLoading: false,
    data: [],
  };
  recommendedUsersConfig: any = {
    isLoading: false,
    data: [],
  };
  @Input() loggedInUser: any;
  constructor(public sharedService: SharedService, private router: Router) {}

  getAllusers() {
    this.recommendedUsersConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.simpleApiCall('getUsers');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response) => {
        this.recommendedUsersConfig.data = response;
        this.recommendedUsersConfig.isLoading = false;
      },
      (error) => {}
    );
  }

  getAllConnections() {
    this.connectedUserConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getAllNetworkConnections', {
      '{userId}': this.loggedInUser.email,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.connectedUserConfig.data = response.connections ? response.connections : [] ;
        this.connectedUserConfig.isLoading = false;
      },
      (error) => {}
    );
  }

  showProfile(tasaId: string) {
    this.router.navigate(['/social-network/profile/', tasaId], { replaceUrl: true });
    this.sharedService.utilityService.changeMessage('FETCH-USER-PROFILE');
  }

  ngOnInit(): void {
    this.getAllusers();
    this.getAllConnections();
  }
}
