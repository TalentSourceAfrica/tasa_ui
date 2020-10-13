import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-tier',
  templateUrl: './tier.component.html',
  styleUrls: ['./tier.component.scss'],
})
export class TierComponent implements OnInit {
  tierData: any = [];

  constructor(public sharedService: SharedService) {}

  addTier() {
    this.tierData.push({
      id: '',
      name: '',
      price: 0,
      currency: '',
      duration: '',
      firstMonthprice: 0,
      feature: [
        {
          featureId: 0,
          description: '',
        },
      ],
    });
  }

  addFeature(tier: any) {
    tier.feature.push({
      featureId: 0,
      description: '',
    });
  }

  removeFeature(tier: any, featIndex: any) {
    tier.feature.splice(featIndex, 1);
  }

  saveTier(tier: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Adding Tier...!');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('updateTier');
    $t.sharedService.configService.post(apiUrl, tier).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Tier Added...!');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  updateTier(tier: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Updating Tier...!');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('updateTier');
    $t.sharedService.configService.put(apiUrl, tier).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Tier Updated...!');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  deleteTier(tier: any, tierIndex: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Deleting Tier...!');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('deleteTier', { '{tierId}': tier.id });
    $t.sharedService.configService.delete(apiUrl).subscribe(
      (response: any) => {
        $t.tierData.splice(tierIndex, 1);
        $t.sharedService.uiService.showApiSuccessPopMsg('Tier Deleted...!');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getTiers() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getTiers');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.tierData = response;
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
