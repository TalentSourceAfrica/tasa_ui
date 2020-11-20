import { Component, OnInit, ViewChild } from '@angular/core';
import { untilDestroyed } from '@app/@core';
import { CredentialsService } from '@app/auth';
import { CreateOrganizationComponent } from '@app/partials/popups/recruiter/create-organization/create-organization.component';
import { SharedService } from '@app/services/shared.service';
import { delay } from 'underscore';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss'],
})
export class OrganizationComponent implements OnInit {
  @ViewChild('newsfile', { static: false }) public newsfile: any;
  selectedNews: any;
  suportedImage = ['.gif', '.png', '.bmp', '.jpeg', '.jpg'];
  activeOrganizationData: any = [];
  inactiveOrganizationData: any = [];
  constructor(public sharedService: SharedService, public credentialsService: CredentialsService) {}

  updateStatus(org: any, status: string) {
    let $t = this;
    org.activeFlag = status;
    $t.sharedService.uiService.showApiStartPopMsg('Updating Organization...!');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('updateOrganization', { '{userId}': $t.user.email });
    $t.sharedService.configService.post(apiUrl, [org]).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Organization Updated...!');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  createOrganization() {
    this.sharedService.dialogService.open(CreateOrganizationComponent, {
      width: '40%',
      disableClose: false,
    });
  }

  deleteOrganization(news: any, newsIndex: any, type: string) {
    let $t = this;
    if (news.id != '') {
      $t.sharedService.uiService.showApiStartPopMsg('Deleting Organization...!');
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('deleteNews', { '{newsId}': news.id });
      $t.sharedService.configService.delete(apiUrl).subscribe(
        (response: any) => {
          if (type === 'Active') {
            $t.activeOrganizationData.splice(newsIndex, 1);
          } else {
            $t.inactiveOrganizationData.splice(newsIndex, 1);
          }

          $t.sharedService.uiService.showApiSuccessPopMsg('Organization Deleted...!');
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    } else {
      // $t.organizationData.splice(newsIndex, 1);
    }
  }

  getOrganization() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getOrganisation');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.activeOrganizationData = response.responseObj.filter((d: any) => d.activeFlag === 'Active');
        $t.inactiveOrganizationData = response.responseObj.filter((d: any) => d.activeFlag !== 'Active');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    this.getOrganization();

    this.sharedService.utilityService.currentMessage.pipe(untilDestroyed(this)).subscribe((message) => {
      if (message === 'TRIGGER-ORGANIZATION-UPDATE') {
        this.getOrganization();
      }
    });
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    
  }
}
