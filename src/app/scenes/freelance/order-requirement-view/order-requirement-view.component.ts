import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

import { requirementProgressStatus, requirementStatus } from '@app/models/constants';
import { SubmitFeedbackPopupComponent } from '@app/partials/popups/freelance/submit-feedback-popup/submit-feedback-popup.component';

@Component({
  selector: 'app-order-requirement-view',
  templateUrl: './order-requirement-view.component.html',
  styleUrls: ['./order-requirement-view.component.scss'],
})
export class OrderRequirementViewComponent implements OnInit {
  @ViewChild('uploadAttachment', { static: false }) public upAttachment: any;
  panelOpenState: boolean = false;
  requirementProgressStatus = JSON.parse(JSON.stringify(requirementProgressStatus));
  requirementStatus = JSON.parse(JSON.stringify(requirementStatus));
  reqDetailsConfig: any = {
    isLoading: false,
    data: {},
    requirementId: 0,
    selectedBidderConversation: [],
    isCompleted: false,
  };
  bidConfig: any = {
    isAlreadyBid: false,
    allBids: [],
    allBidders: [],
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
      description: '',
      attachment: '',
      tat: 0,
      cost: 0,
      commission: 10,
      deliveryPrice: 0,
      negotiable: 'Y',
      status: 'Auctioned',
      createdOn: '',
      createdBy: '',
      updatedOn: '',
      updatedBy: '',
    },
  };

  reqProgressConfig: any = {
    percent: 0,
    color: 'primary',
    mode: 'determinate',
  };

  commentConfig: any = {
    newComment: {
      id: '',
      content: '',
      post: true,
      userName: this.user.firstName + ' ' + this.user.lastName,
      userImageUrl: this.user.image,
      userId: this.user.email,
      videoUrl: '',
      tasaId: this.user.tasaId,
      type: this.user.type,
      imageUrl: '',
      shareLink: '',
      shareArticle: '',
    },
  };

  constructor(
    public sharedService: SharedService,
    private route: ActivatedRoute,
    private credentialsService: CredentialsService,
    private router: Router
  ) {
    this.reqDetailsConfig.requirementId = this.route.snapshot.params.requirementId;
    // create Progress Percent base on stages;
    this.requirementProgressStatus.forEach((d: any, i: number) => {
      d['percent'] = ((i + 1) / this.requirementProgressStatus.length) * 100;
    });
  }

  addComment() {
    this.reqDetailsConfig.selectedBidderConversation.push({ ...this.commentConfig.newComment });
  }

  postComment(comment: any, bidId: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Adding Comment...');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('addComment', {
      '{postId}': bidId,
    });
    $t.sharedService.configService.post(apiUrl, comment).subscribe(
      (response: any) => {
        $t.reqDetailsConfig.selectedBidderConversation = response.responseObj.comments;
        $t.sharedService.uiService.showApiSuccessPopMsg('Comment Shared...');
        $t.addComment();
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  fetchPostById(_bidId: any) {
    let $t = this;
    $t.reqDetailsConfig.selectedBidderConversation = [];
    let api = $t.sharedService.urlService.apiCallWithParams('getPostById', {
      '{postId}': _bidId,
    });
    $t.sharedService.configService.get(api).subscribe(
      (response: any) => {
        if (response.responseObj.comments.length) {
          $t.reqDetailsConfig.selectedBidderConversation = response.responseObj.comments;
        }
        $t.addComment();
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error);
      }
    );
  }

  onExapansionPanel(_bid: any) {
    this.panelOpenState = true;
    this.fetchPostById(_bid.id);
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

  changeReqStage(item: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Updating Stage');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('updateRequirementStage', {
      '{requirementId}': item.id,
      '{stage}': item.stage,
      '{userId}': $t.user.email,
    });
    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        if (item.stage === 'Completed') {
          $t.reqDetailsConfig.isCompleted = true;
        }
        $t.sharedService.uiService.showApiSuccessPopMsg('Stage Updated');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getReqDetail() {
    let $t = this;
    $t.reqDetailsConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getRequirement', {
      '{requirementId}': $t.reqDetailsConfig.requirementId,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.reqDetailsConfig.data = response.responseObj;
        if ($t.reqDetailsConfig.data.stage === 'Completed') {
          $t.reqDetailsConfig.isCompleted = true;
        }
        const currentProgressStage = $t.requirementProgressStatus.find(
          (d: any) => d.value === $t.reqDetailsConfig.data.stage
        );
        $t.reqDetailsConfig.data['reqProgressConfig'] = { ...$t.reqProgressConfig };
        $t.reqDetailsConfig.data['reqProgressConfig'].percent = currentProgressStage.percent.toFixed(2);
        // disable all previous stages
        $t.requirementProgressStatus.forEach((d: any, i: number) => {
          d['disable'] = i <= currentProgressStage.id - 1 ? true : false;
        });

        $t.reqDetailsConfig.isLoading = false;
        if ($t.reqDetailsConfig.data.createdBy === $t.user.email) {
          $t.getAllBid();
        } else {
          $t.getAllShallowBidders();
          $t.getCurrentUserBid();
        }
      },
      (error) => {
        $t.reqDetailsConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getCurrentUserBid() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('fetchUserSpecificBid', {
      '{requirementId}': $t.reqDetailsConfig.requirementId,
      '{tasaId}': $t.user.tasaId,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        response.responseObj ? ($t.bidConfig.bid = response.responseObj) : null;
        $t.fetchPostById($t.bidConfig.bid.id);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  checkBidValidation() {
    if (this.bidConfig.bid.description === '' || this.bidConfig.bid.tat === 0 || this.bidConfig.bid.cost === 0) {
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

    if ($t.bidConfig.bid.id === '') {
      $t.sharedService.uiService.showApiStartPopMsg('Posting Bid.');
    } else {
      $t.sharedService.uiService.showApiStartPopMsg('Updating Bid.');
    }
    $t.sharedService.configService.post(apiUrl, $t.bidConfig.bid).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
        $t.getReqDetail();
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
        $t.bidConfig.bid = $t.bidConfig.allBids[0];
        $t.onExapansionPanel($t.bidConfig.bid);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getAllShallowBidders() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('fetchAllBidsForRequirement', {
      '{requirementId}': $t.reqDetailsConfig.requirementId,
      '{status}': 'All',
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.bidConfig.allBidders = response.responseObj;
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getDeliveryPrice(bid: any) {
    if (bid.cost > 0) {
      const dp = bid.cost * (bid.commission / 100) + bid.cost;
      bid.deliveryPrice = dp;
      return dp;
    }
  }

  openFeedbackPopup() {
    let buyerDetails: any = {
      email: this.reqDetailsConfig.data.createdBy,
      name: this.reqDetailsConfig.data.postedByName,
      tasaId: this.reqDetailsConfig.data.postedByTasaId,
      userImage: this.reqDetailsConfig.postedByImage,
    };
    this.sharedService.dialogService.open(SubmitFeedbackPopupComponent, {
      width: '700px',
      data: {
        buyerDetails: buyerDetails,
        user: this.user,
      },
      disableClose: false,
    });
  }

  ngOnInit(): void {
    this.getReqDetail();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
