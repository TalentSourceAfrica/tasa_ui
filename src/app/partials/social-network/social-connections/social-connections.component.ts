import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-social-connections',
  templateUrl: './social-connections.component.html',
  styleUrls: ['./social-connections.component.scss'],
})
export class SocialConnectionsComponent implements OnInit {
  allUsers: any = [];
  constructor(public sharedService: SharedService) {}

  getAllusers() {
    let apiUrl = this.sharedService.urlService.simpleApiCall('getUsers');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response) => {
        this.allUsers = response;
        console.log(this.allUsers);
      },
      (error) => {}
    );
  }

  ngOnInit(): void {
    this.getAllusers();
  }
}
