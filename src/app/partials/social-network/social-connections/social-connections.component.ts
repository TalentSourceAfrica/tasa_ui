import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-social-connections',
  templateUrl: './social-connections.component.html',
  styleUrls: ['./social-connections.component.scss'],
})
export class SocialConnectionsComponent implements OnInit {
  allUsers: any = [];
  isLoading:boolean = true;
  constructor(public sharedService: SharedService, private router: Router) {}

  getAllusers() {
    let apiUrl = this.sharedService.urlService.simpleApiCall('getUsers');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response) => {
        this.allUsers = response;
        this.isLoading = false;
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
  }
}
