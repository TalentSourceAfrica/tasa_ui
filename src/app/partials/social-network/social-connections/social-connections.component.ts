import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SocialnetworkService } from '@app/scenes/social-network/socialnetwork.service';
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
  searchedName:string = '';
  connectedUserConfig: any = {
    isLoading: false,
    data: [],
  };
  recommendedUsersConfig: any = {
    isLoading: false,
    data: [],
  };
  @Input() loggedInUser: any;
  constructor(
    public sharedService: SharedService,
    private router: Router,
    private socialnetworkService: SocialnetworkService
  ) {}

  getAllusers() {
    this.recommendedUsersConfig.isLoading = true;
    this.socialnetworkService.getAllusers().subscribe(
      (response) => {
        this.recommendedUsersConfig.data = response;
        this.recommendedUsersConfig.isLoading = false;
      },
      (error) => {}
    );
  }

  getAllConnections() {
    this.connectedUserConfig.isLoading = true;
    this.socialnetworkService.getAllConnections().subscribe(
      (response: any) => {
        this.connectedUserConfig.data = response ;
        this.connectedUserConfig.isLoading = false;
      },
      (error) => {}
    );
  }

  showProfile(tasaId: string) {
    this.router.navigate(['/social-network/profile/', tasaId], { replaceUrl: true });
    this.sharedService.utilityService.changeMessage('VIEW-USER-PROFILE');
  }

  message(emailId: string) {
    this.router.navigate(['/social-network/conversation/'], { replaceUrl: true, queryParams: { userId: emailId } });
  }

  ngOnInit(): void {
    this.getAllusers();
    this.getAllConnections();
  }
}
