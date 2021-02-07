import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '@app/services/shared.service';
import { CredentialsService } from '@app/auth';

@Component({
  selector: 'app-organization-view',
  templateUrl: './organization-view.component.html',
  styleUrls: ['./organization-view.component.scss'],
})
export class OrganizationViewComponent implements OnInit {
  orgConfig: any = {
    orgId: '',
    org: undefined,
    fetchingOrg: true,
  };
  isAdmin: boolean = false;

  constructor(
    private sharedService: SharedService,
    public route: ActivatedRoute,
    public router: Router,
    public credentialsService: CredentialsService
  ) {
    this.orgConfig.orgId = this.route.snapshot.params.orgId;
    this.user && this.user.type.toLowerCase() == 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
  }

  changeOrgStatus(_org: any, _statusToSet: string) {
    let $t = this;
    let startMsg = _statusToSet == 'Active' ? 'Activating Organization...!' : 'Inactivating Organization...!';
    let successMsg = _statusToSet == 'Active' ? 'Organization Activated...!' : 'Organization Inactivated...!';
    $t.sharedService.uiService.showApiStartPopMsg(startMsg);
    let apiUrl = $t.sharedService.urlService.simpleApiCall('updateSingleOrganization');
    _org.activeFlag = _statusToSet;
    $t.sharedService.configService.put(apiUrl, _org).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg(successMsg);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getOrgDetail() {
    let $t = this;
    $t.orgConfig.fetchingOrg = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getSingleOrganization', {
      '{orgId}': $t.orgConfig.orgId,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.orgConfig.org = response.responseObj;
        $t.orgConfig.fetchingOrg = false;
      },
      (error) => {
        $t.orgConfig.fetchingJob = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        setTimeout(() => {
          $t.sharedService.uiService.closePopMsg();
          $t.router.navigate(['/admin/organization'], { replaceUrl: true });
        }, 2000);
      }
    );
  }

  deleteOrganization(org: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Deleting Organization...!');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('deleteOrganisation', { '{orgId}': org.id });
    $t.sharedService.configService.delete(apiUrl).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Organization Deleted...!');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.getOrgDetail();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
