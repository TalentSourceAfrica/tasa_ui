import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-lov',
  templateUrl: './lov.component.html',
  styleUrls: ['./lov.component.scss'],
})
export class LovComponent implements OnInit {
  selectedNews: any;
  lovsData: any = [];
  selectedGroup: any = '';
  selectedLovsData: any;
  constructor(public sharedService: SharedService) {}

  addGrp() {
    this.lovsData.push({
      id: '',
      group: '',
      value: [],
    });
  }

  afterGrpChange() {
    this.selectedLovsData = this.lovsData.find((d: any) => d.group == this.selectedGroup);
  }

  addVal() {
    this.selectedLovsData.value.push({ code: '', desc: '', subValue1: '', subValue2: '', subValue3: '' });
  }

  saveLovs(lov: any, lovIndex: number) {
    let $t = this;
    // if ($t.lovsData.map((d: any) => d.group.toLowerCase()).includes(lov.group.toLowerCase())) {
    //   $t.sharedService.uiService.showApiErrorPopMsg('Group Name Must be Unique');
    //   return;
    // }
    $t.sharedService.uiService.showApiStartPopMsg('Adding LOV...!');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('addLov');
    $t.sharedService.configService.post(apiUrl, lov).subscribe(
      (response: any) => {
        $t.lovsData[lovIndex] = response;
        $t.sharedService.uiService.showApiSuccessPopMsg('LOV Added...!');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  updateLov(lov: any, _isDeleteVal?: boolean) {
    let $t = this;
    let apiStartMsg = '';
    let apiEndMsg = '';
    if (_isDeleteVal) {
      apiStartMsg = 'Deleting Value...!';
      apiEndMsg = 'Value Deleted...!';
    } else {
      apiStartMsg = 'Updating LOV...!';
      apiEndMsg = 'LOV Updated...!';
    }
    $t.sharedService.uiService.showApiStartPopMsg(apiStartMsg);
    let apiUrl = $t.sharedService.urlService.simpleApiCall('updateLov');
    $t.sharedService.configService.put(apiUrl, lov).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg(apiEndMsg);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  deleteVal(selectedLov: any, selectedLovIndex: number) {
    selectedLov.value.splice(selectedLovIndex, 1);
    this.updateLov(selectedLov, true);
  }

  deleteLov(lov: any, lovIndex: number) {
    let $t = this;
    if (lov.id) {
      $t.sharedService.uiService.showApiStartPopMsg('Deleting LOV...!');
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('deleteLov', { '{lovId}': lov.id });
      $t.sharedService.configService.delete(apiUrl).subscribe(
        (response: any) => {
          $t.lovsData.splice(lovIndex, 1);
          $t.sharedService.uiService.showApiSuccessPopMsg('LOV Deleted...!');
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    } else {
      $t.lovsData.splice(lovIndex, 1);
    }
  }

  getLovs() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getLovs');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.lovsData = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.getLovs();
  }
}
