import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-all-notifications',
  templateUrl: './all-notifications.component.html',
  styleUrls: ['./all-notifications.component.scss'],
})
export class AllNotificationsComponent implements OnInit {
  allNotifications: any = [];

  constructor(
    public sharedService: SharedService,
    public credentialsService: CredentialsService,
    public router: Router
  ) {}

  notiRedirect(_noti: any) {
    if (_noti.jobId !== '') {
      this.router.navigate(['/job/' + _noti.jobId], { replaceUrl: true });
    } else if (_noti.courseId !== '') {
      this.router.navigate(['/course/' + _noti.courseId], { replaceUrl: true });
    }
  }

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
    let _callBack = () => {
      let apiUrl = $t.sharedService.urlService.simpleApiCall('deleteNotifications');
      $t.sharedService.uiService.showApiStartPopMsg('Deleting Notification...');
      $t.sharedService.configService.deleteWithBody(apiUrl, [_id]).subscribe(
        (response: any) => {
          $t.allNotifications.splice(notiIndex, 1);
          $t.sharedService.uiService.showApiSuccessPopMsg('Notification Deleted...');
          $t.sharedService.utilityService.changeMessage('TRIGGER-HEADER-NOTIFICATIONS-UPDATE');
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    };
    $t.sharedService.uiService.showPreConfirmPopMsg('You Want To Delete The Notification.', _callBack);
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    this.getNotifications();
  }
}
