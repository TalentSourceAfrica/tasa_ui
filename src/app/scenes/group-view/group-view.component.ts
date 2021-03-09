import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.scss'],
})
export class GroupViewComponent implements OnInit {
  groupDetailsConfig: any = {
    isLoading: false,
    data: {},
    groupId: 0,
  };

  constructor(public sharedService: SharedService, private route: ActivatedRoute) {}

  getGroupDetail() {
    let $t = this;
    $t.groupDetailsConfig.groupId = $t.route.snapshot.params.groupId;
    $t.groupDetailsConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getGroupInfo', {
      '{groupId}': this.groupDetailsConfig.groupId,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.groupDetailsConfig.data = response.responseObj;
        this.groupDetailsConfig.isLoading = false;
      },
      (error) => {
        this.groupDetailsConfig.isLoading = false;
        this.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.getGroupDetail();
  }
}
