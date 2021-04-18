import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { requirementProgressStatus } from '@app/models/constants';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit {
  requirementProgressStatus = JSON.parse(JSON.stringify(requirementProgressStatus));
  orderConfig: any = {
    data: [],
    isLoading: false,
    gigSearchText: '',
    isSearching: false,
  };

  reqProgressConfig: any = {
    percent: 0,
    color: 'primary',
    mode: 'determinate',
  };

  constructor(public sharedService: SharedService, private credentialsService: CredentialsService) {
    // create Progress Percent base on stages;
    this.requirementProgressStatus.forEach((d: any, i: number) => {
      d['percent'] = ((i + 1) / this.requirementProgressStatus.length) * 100;
    });
  }

  changeReqStage(item: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Updating Stage');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('updateRequirementStage', {
      '{requirementId}': item.requirementId,
      '{stage}': item.progressStatus,
      '{userId}': this.user.email,
    });
    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Stage Updated');
        $t.checkReqProgress(item);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  checkReqProgress(item: any) {
    let $t = this;
    item.isLoadingProgress = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getRequirement', {
      '{requirementId}': item.requirementId,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        item.progressStatus = response.responseObj.stage;
        const currentProgressStage = $t.requirementProgressStatus.find(
          (d: any) => d.value === item.progressStatus
        );
        item['reqProgressConfig'] = { ...$t.reqProgressConfig };
        item['reqProgressConfig'].percent = currentProgressStage.percent.toFixed(2)
        // disable all previous stages
        $t.requirementProgressStatus.forEach((d: any, i: number) => {
          d['disable'] = i <= (currentProgressStage.id - 1) ? true : false
        });

        item.isLoadingProgress = false;
      },
      (error) => {
        item.isLoadingProgress = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getOrder() {
    let $t = this;
    $t.orderConfig.isLoading = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('fetchAllOrder', {
      '{tasaId}': $t.user.tasaId,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.orderConfig.data = response.responseObj.transactions;
        $t.orderConfig.data.forEach((element: any) => {
          element['progressStatus'] = '';
        });
        $t.orderConfig.isLoading = false;
      },
      (error) => {
        $t.orderConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.getOrder();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
