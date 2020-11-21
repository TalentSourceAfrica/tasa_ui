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
  uds: any;
  suportedImage = ['.gif', '.png', '.bmp', '.jpeg', '.jpg'];
  organizationData: any = [];
  activeOrganizationData: any = [];
  inactiveOrganizationData: any = [];
  constructor(public sharedService: SharedService, public credentialsService: CredentialsService) {
    this.uds = this.sharedService.plugins.undSco;
  }

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
        placement: 'right',
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
          $t.activeOrganizationData =  $t.uds.uniq($t.activeOrganizationData, (d: any) => {
            return d.id;
          });
        } else {
          $t.activeOrganizationData.splice(orgIndex, 1);
          $t.inactiveOrganizationData.push(org);
          $t.inactiveOrganizationData = $t.uds.uniq($t.inactiveOrganizationData, (d: any) => {
            return d.id;
          });
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
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('deleteOrganisation', { '{orgId}': org.id });
    $t.sharedService.configService.delete(apiUrl).subscribe(
      (response: any) => {
        if (type === 'Active') {
          $t.activeOrganizationData.splice(orgIndex, 1);
        } else if (type === 'All') {
          $t.organizationData.splice(orgIndex, 1);
          $t.distributeData();
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
        $t.organizationData = response.responseObj;
        $t.distributeData();

        setTimeout(() => {
          $t.descriptionInfo();
        }, 1000);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  distributeData() {
    let $t = this;
    $t.activeOrganizationData = $t.organizationData.filter((d: any) => d.activeFlag === 'Active');
    $t.inactiveOrganizationData = $t.organizationData.filter((d: any) => d.activeFlag !== 'Active');
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
