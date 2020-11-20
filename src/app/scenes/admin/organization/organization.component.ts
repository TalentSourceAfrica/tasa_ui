import { Component, OnInit, ViewChild } from '@angular/core';
import { untilDestroyed } from '@app/@core';
import { CredentialsService } from '@app/auth';
import { CreateOrganizationComponent } from '@app/partials/popups/recruiter/create-organization/create-organization.component';
import { SharedService } from '@app/services/shared.service';
import { delay } from 'underscore';

declare var jQuery: any;

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

  descriptionInfo() {
    jQuery('.org-description').on('mouseover', function (e: any) {
      let description = jQuery(this).attr('data-desc');
      jQuery(this).webuiPopover({
        title: 'Description',
        trigger: 'hover',
        animation: 'pop',
        type: 'html',
        multi: false,
        content: description,
        closeable: true,
        placement:'right',
        width: '400',
      });
      jQuery(this).webuiPopover('show');
    });
  }

  updateStatus(org: any, status: string, orgIndex: number) {
    let $t = this;
    let startMsg = '';
    let succMsg = '';
    org.activeFlag = status;
    if (status === 'Active') {
      startMsg = 'Activating Organization...!';
      succMsg = 'Organization Activated...!';
    } else {
      startMsg = 'Inactivating Organization...!';
      succMsg = 'Organization Inactivated...!';
    }

    $t.sharedService.uiService.showApiStartPopMsg(startMsg);
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('updateOrganization', { '{userId}': $t.user.email });
    $t.sharedService.configService.post(apiUrl, [org]).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg(succMsg);
        if (status === 'Active') {
          $t.inactiveOrganizationData.splice(orgIndex, 1);
          $t.activeOrganizationData.push(org);
        } else {
          $t.activeOrganizationData.splice(orgIndex, 1);
          $t.inactiveOrganizationData.push(org);
        }
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

  deleteOrganization(org: any, orgIndex: any, type: string) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Deleting Organization...!');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('deleteNews', { '{newsId}': org.id });
    $t.sharedService.configService.delete(apiUrl).subscribe(
      (response: any) => {
        if (type === 'Active') {
          $t.activeOrganizationData.splice(orgIndex, 1);
        } else {
          $t.inactiveOrganizationData.splice(orgIndex, 1);
        }

        $t.sharedService.uiService.showApiSuccessPopMsg('Organization Deleted...!');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getOrganization() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getOrganisation');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.activeOrganizationData = response.responseObj.filter((d: any) => d.activeFlag === 'Active');
        $t.inactiveOrganizationData = response.responseObj.filter((d: any) => d.activeFlag !== 'Active');
        setTimeout(() => {
          $t.descriptionInfo();
        }, 1000);
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
