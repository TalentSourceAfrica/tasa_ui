import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss'],
})
export class SubscriptionPlansComponent implements OnInit {
  tiers: any;
  constructor(public sharedService: SharedService) {}

  getTiers() {
    let apiUrl = this.sharedService.urlService.simpleApiCall('getTiers');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.tiers = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.getTiers();
  }
}
