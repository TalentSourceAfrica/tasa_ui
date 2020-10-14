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
  constructor(public sharedService: SharedService) {}

  addNews() {
    this.lovsData.push({
      id: '',
      group: '',
      code: '',
      desc: '',
      subValue1: '',
      subValue2: '',
      subValue3: '',
    });
  }

  saveLovs(lov: any, lovIndex: number) {
    let $t = this;
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

  updateLov(lov: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Updating LOV...!');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('updateLov');
    $t.sharedService.configService.put(apiUrl, lov).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('LOV Updated...!');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  deleteLov(lov: any, lovIndex: any) {
    let $t = this;
    if (lov.id) {
      $t.sharedService.uiService.showApiStartPopMsg('Deleting LOV...!');
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('deleteLov', { '{lovId}': lov.id });
      $t.sharedService.configService.delete(apiUrl).subscribe(
        (response: any) => {
          $t.lovsData.splice(lovIndex, 1);
          $t.sharedService.uiService.showApiSuccessPopMsg('News Deleted...!');
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
