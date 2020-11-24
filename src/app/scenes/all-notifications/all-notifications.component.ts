import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-all-notifications',
  templateUrl: './all-notifications.component.html',
  styleUrls: ['./all-notifications.component.scss'],
})
export class AllNotificationsComponent implements OnInit {
  allNotifications: any = [];

  constructor(public sharedService: SharedService, public credentialsService: CredentialsService) {}

  getNotifications() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getAllNotifications', { '{userId}': $t.user.email });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.allNotifications = response.responseObj;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteNotifications(_id: any, notiIndex: number) {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('deleteNotifications');
    $t.sharedService.uiService.showApiStartPopMsg('Deleting Notification...');
    $t.sharedService.configService.deleteWithBody(apiUrl, [_id]).subscribe(
      (response: any) => {
        $t.allNotifications.splice(notiIndex, 1);
        $t.sharedService.uiService.showApiSuccessPopMsg('Notification Deleted...');
        if($t.allNotifications.length === 0){
          $t.sharedService.utilityService.changeMessage('TRIGGER-HEADER-NOTIFICATIONS-UPDATE');
        }
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    this.getNotifications();
  }
}
