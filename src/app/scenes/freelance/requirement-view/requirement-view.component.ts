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
  bidConfig: any = {
    isAlreadyBid: false,
    allBids: [],
    bid: {
      id: '',
      userId: this.user.email,
      tasaId: this.user.tasaId,
      userName: this.user.firstName + ' ' + this.user.lastName,
      userImage: this.user.image,
      requirementId: '',
      requirementBy: '',
      requirementByTasaId: '',
      requirementByName: '',
      requirementByImage: '',
      comments: '',
      attachment: '',
      tat: 0,
      cost: 0,
      negotiable: 'Y',
      status: 'Auctioned',
      createdOn: '',
      createdBy: '',
      updatedOn: '',
      updatedBy: '',
    },
  };

  constructor(
    public sharedService: SharedService,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService
  ) {
    this.reqDetailsConfig.requirementId = this.route.snapshot.params.requirementId;
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
        $t.bidConfig.bid.attachment = response.url;
        $t.sharedService.uiService.showApiSuccessPopMsg('Uploaded...');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
      }
    );
  }
  getReqDetail() {
    let $t = this;
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

  checkBidValidation() {
    if (this.bidConfig.bid.comments === '' || this.bidConfig.bid.tat === 0 || this.bidConfig.bid.cost === 0) {
      return true;
    } else {
      return false;
    }
  }

  postBid() {
    let $t = this;

    $t.bidConfig.bid.requirementId = $t.reqDetailsConfig.requirementId;
    $t.bidConfig.bid.requirementBy = $t.reqDetailsConfig.data.createdBy;
    $t.bidConfig.bid.requirementByTasaId = $t.reqDetailsConfig.data.postedByTasaId;
    $t.bidConfig.bid.requirementByName = $t.reqDetailsConfig.data.postedByName;
    $t.bidConfig.bid.requirementByImage = $t.reqDetailsConfig.data.postedByImage;

    let apiUrl = $t.sharedService.urlService.apiCallWithParams('postBid', {
      '{requirementId}': $t.reqDetailsConfig.requirementId,
      '{userId}': $t.user.email,
    });
    $t.sharedService.uiService.showApiStartPopMsg('Posting Bid.');
    $t.sharedService.configService.post(apiUrl, $t.bidConfig.bid).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getAllBid() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('fetchAllBid', {
      '{requirementId}': $t.reqDetailsConfig.requirementId,
      '{status}': 'All',
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.bidConfig.allBids = response.responseObj;
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.getReqDetail();
    this.getAllBid();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
