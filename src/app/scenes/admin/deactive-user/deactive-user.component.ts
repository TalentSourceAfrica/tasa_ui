import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-deactive-user',
  templateUrl: './deactive-user.component.html',
  styleUrls: ['./deactive-user.component.scss'],
})
export class DeactiveUserComponent implements OnInit {
  userData: any = [];
  constructor(public sharedService: SharedService) {}

  deactiveUser(user: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Deactivating User...!');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('deactivateUser', { '{userId}': user.email });
    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('User Is Deactivated...!');
        user.active = 'N';
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  activeUser(user: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Activating User...!');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('activateUser', { '{userId}': user.email });
    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('User Is Activated...!');
        user.active = 'Y';
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getAlluser() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getUsers');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.userData = response;
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.getAlluser();
  }
}
