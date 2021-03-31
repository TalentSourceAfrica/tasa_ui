import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-requirement-view',
  templateUrl: './requirement-view.component.html',
  styleUrls: ['./requirement-view.component.scss'],
})
export class RequirementViewComponent implements OnInit {
  @ViewChild('uploadAttachment', { static: false }) public upAttachment: any;
  reqDetailsConfig: any = {
    isLoading: false,
    data: {},
    requirementId: 0,
  };
  bid: any = {
    id: '',
    userId: this.user.email,
    tasaId: this.user.tasaId,
    userImage: this.user.image,
    requirementId: this.reqDetailsConfig.requirementId,
    requirementBy: this.reqDetailsConfig.data.createdBy,
    comments: '',
    attachment: '',
    tat: 0,
    cost: 0,
    negotiable: '',
    status: 'Auctioned',
    createdOn: '',
    createdBy: '',
    updatedOn: '',
    updatedBy: '',
  };
  constructor(
    public sharedService: SharedService,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService
  ) {}

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
        $t.bid.attachment = response.url;
        $t.sharedService.uiService.showApiSuccessPopMsg('Uploaded...');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
      }
    );
  }
  getReqDetail() {
    let $t = this;
    $t.reqDetailsConfig.requirementId = $t.route.snapshot.params.requirementId;
    $t.reqDetailsConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getRequirement', {
      '{requirementId}': this.reqDetailsConfig.requirementId,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.reqDetailsConfig.data = response.responseObj;
        this.reqDetailsConfig.isLoading = false;
      },
      (error) => {
        this.reqDetailsConfig.isLoading = false;
        this.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.getReqDetail();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
