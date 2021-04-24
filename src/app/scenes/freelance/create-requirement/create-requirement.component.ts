import { Component, OnInit, ViewChild } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { Editor } from 'ngx-editor';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-create-requirement',
  templateUrl: './create-requirement.component.html',
  styleUrls: ['./create-requirement.component.scss'],
})
export class CreateRequirementComponent implements OnInit {
  @ViewChild('uploadAttachment', { static: false }) public upAttachment: any;
  public editor: Editor;
  freelanceCategory: any = [];
  requirementConfig: any = {
    isLoading: false,
    isStart: true,
    isNew: true,
    activeRequirements: [],
    inactiveRequirements: [],
    requirement: {
      id: '',
      postedBy: this.user.email,
      postedByTasaId: this.user.tasaId,
      postedByName: this.user.firstName + ' ' + this.user.lastName,
      postedByImage: this.user.image,
      description: '',
      attachment: '',
      category: '',
      skills: '',
      experienceFrom: 0,
      experienceTo: 0,
      budgetFrom: 0,
      budgetTo: 0,
      open: 'Y',
      openTill: '',
      stage: '',
      completePerc: 0,
      active: 'Y',
      createdOn: '',
      createdBy: '',
      updatedOn: '',
      updatedBy: '',
    },
  };
  constructor(private credentialsService: CredentialsService, public sharedService: SharedService) {}

  checkValidation() {
    if (
      this.requirementConfig.requirement.description === '' ||
      this.requirementConfig.requirement.attachment === '' ||
      this.requirementConfig.requirement.category === '' ||
      this.requirementConfig.requirement.skills === '' ||
      !this.requirementConfig.requirement.openTill ||
      this.requirementConfig.requirement.experienceTo === 0 ||
      this.requirementConfig.requirement.budgetFrom === 0 ||
      this.requirementConfig.requirement.budgetTo === 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  editReq(req: any) {
    this.requirementConfig.requirement = req;
    this.requirementConfig.isStart = true;
  }

  activeInactiveReq(req: any, type: string) {
    let $t = this;
    let apiUrl: any;
    let succMsg = '';
    $t.sharedService.uiService.showApiStartPopMsg('Updating...');
    if (type === 'active') {
      succMsg = 'Your requirement is active now.';
      apiUrl = $t.sharedService.urlService.apiCallWithParams('activateRequirement', {
        '{requirementId}': req.id,
        '{userId}': $t.user.email,
      });
    } else {
      succMsg = 'Your requirement is inactive now.';
      apiUrl = $t.sharedService.urlService.apiCallWithParams('deactivateRequirement', {
        '{requirementId}': req.id,
        '{userId}': $t.user.email,
      });
    }
    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        $t.fetchUserRequirement();
        $t.sharedService.uiService.showApiSuccessPopMsg(succMsg);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
      }
    );
  }

  submit() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('postRequirement', { '{userId}': $t.user.email });

    if ($t.requirementConfig.requirement.id === '') {
      $t.sharedService.uiService.showApiStartPopMsg('Adding Requirement...');
      $t.sharedService.configService.post(apiUrl, $t.requirementConfig.requirement).subscribe(
        (response: any) => {
          $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
          $t.fetchUserRequirement();
        },
        (error) => {
          $t.sharedService.uiService.showApiSuccessPopMsg(error.error.message);
        }
      );
    } else {
      $t.sharedService.uiService.showApiStartPopMsg('Updating Requirement...');
      $t.sharedService.configService.put(apiUrl, $t.requirementConfig.requirement).subscribe(
        (response: any) => {
          $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
          $t.fetchUserRequirement();
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    }
  }

  triggerUpload() {
    this.upAttachment.nativeElement.click();
  }

  uploadFile(_event: any) {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadSingle', { '{email}': $t.user.email });
    let files = _event.target.files;
    var form = new FormData();
    form.append('file', files[0], files[0].name);
    $t.sharedService.uiService.showApiStartPopMsg('Uploading Attachment...');
    $t.sharedService.configService.post(apiUrl, form).subscribe(
      (response: any) => {
        $t.requirementConfig.requirement.attachment = response.url;
        $t.sharedService.uiService.showApiSuccessPopMsg('Uploaded...');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
      }
    );
  }

  getFreelanceCategory() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getLovsByGroup', { '{group}': 'FreelanceCategory' });
    $t.sharedService.configService.get(apiUrl).subscribe((response) => {
      $t.freelanceCategory = response[0].value;
    });
  }

  fetchUserRequirement() {
    let $t = this;
    $t.requirementConfig.isLoading = true;
    let apiUrl1 = $t.sharedService.urlService.apiCallWithParams('getUserActiveRequirements', {
      '{userId}': $t.user.email,
    });
    let apiUrl2 = $t.sharedService.urlService.apiCallWithParams('getUserInactiveRequirements', {
      '{userId}': $t.user.email,
    });

    let api1 = $t.sharedService.configService.get(apiUrl1);
    let api2 = $t.sharedService.configService.get(apiUrl2);

    forkJoin([api1, api2]).subscribe(
      (response: any) => {
        $t.requirementConfig.activeRequirements = response[0].responseObj;
        $t.requirementConfig.activeRequirements = $t.requirementConfig.activeRequirements.filter((d: any) => {
          d.winningGigCardId === '';
        });

        $t.requirementConfig.inactiveRequirements = response[1].responseObj;
        $t.requirementConfig.inactiveRequirements = $t.requirementConfig.inactiveRequirements.filter((d: any) => {
          d.winningGigCardId === '';
        });
        if ($t.requirementConfig.activeRequirements.length || $t.requirementConfig.inactiveRequirements.length) {
          $t.requirementConfig.isNew = false;
          $t.requirementConfig.isStart = false;
        }
        $t.requirementConfig.isLoading = false;
      },
      (error) => {
        $t.requirementConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.getFreelanceCategory();
    this.fetchUserRequirement();
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
