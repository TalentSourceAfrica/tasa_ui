import { Component, OnInit, ViewChild } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { Editor } from 'ngx-editor';

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
    isFirst: true,
    requirement: {
      id: '',
      postedBy: this.user.firstName + ' ' + this.user.lastName,
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

  submit() {}

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
        $t.requirementConfig.attachment = response.url;
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

  ngOnInit(): void {
    this.getFreelanceCategory();
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
