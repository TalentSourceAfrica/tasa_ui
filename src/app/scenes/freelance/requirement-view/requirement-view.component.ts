import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

import { requirementStatus } from '@app/models/constants';
import Swal from 'sweetalert2';
import { CartService } from '@app/scenes/cart/cart.service';

@Component({
  selector: 'app-requirement-view',
  templateUrl: './requirement-view.component.html',
  styleUrls: ['./requirement-view.component.scss'],
})
export class RequirementViewComponent implements OnInit {
  @ViewChild('uploadAttachment', { static: false }) public upAttachment: any;
  panelOpenState: boolean = false;
  requirementStatus = JSON.parse(JSON.stringify(requirementStatus));
  reqDetailsConfig: any = {
    isLoading: false,
    data: {},
    requirementId: 0,
    selectedBidderConversation: [],
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
      negotiable: 'Y',
      status: 'Auctioned',
      createdOn: '',
      createdBy: '',
      updatedOn: '',
      updatedBy: '',
    },
  };

  allShalowBidsOptions: OwlOptions = {
    loop: false,
    autoplay: false,
    center: true,
    smartSpeed: 1000,
    dots: false,
    autoHeight: false,
    autoWidth: true,
    autoplayHoverPause: true,
    items: 3,
    nav: true,
    navText: ["<i class='fas fa-chevron-circle-left'></i>", "<i class='fas fa-chevron-circle-right'></i>"],
    autoplayTimeout: 3000,
    responsive: {
      0: {
        items: 1,
      },
      150: {
        items: 2,
      },
      300: {
        items: 3,
      },
    },
  };

  commentConfig: any = {
    newComment: {
      id:'',
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
    private cartService: CartService,
    private router: Router
  ) {
    this.reqDetailsConfig.requirementId = this.route.snapshot.params.requirementId;
  }

  addComment() {
    this.reqDetailsConfig.selectedBidderConversation.push({...this.commentConfig.newComment});
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

  getReqDetail() {
    let $t = this;
    $t.reqDetailsConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getRequirement', {
      '{requirementId}': $t.reqDetailsConfig.requirementId,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.reqDetailsConfig.data = response.responseObj;
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

  changeBidStatus(bid: any) {
    let $t = this;
    if (bid.status === 'Selected') {
      $t.purchaseBidder(bid);
    } else {
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('updateBidStatus', {
        '{bidId}': bid.id,
        '{status}': bid.status,
        '{userId}': $t.user.email,
      });
      $t.sharedService.uiService.showApiStartPopMsg('Updating Bid Status.');
      $t.sharedService.configService.post(apiUrl, $t.bidConfig.bid).subscribe(
        (response: any) => {
          $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
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

  purchaseBidder(_bidderDetails: any) {
    let $t = this;
    $t.sharedService.uiService.closePopMsg();
    let _callback = () => {
      $t.reqDetailsConfig.data = { ...$t.reqDetailsConfig.data, bidderDetails: _bidderDetails };
      $t.cartService.setCartForCustomGig($t.reqDetailsConfig.data);
      Swal.fire({
        title: 'Added..!', // title of the modal
        text: '', // description of the modal
        type: 'success', // warning, error, success, info, and question,
        backdrop: true,
        confirmButtonClass: 'rounded-pill shadow-sm',
        cancelButtonClass: 'rounded-pill shadow-sm',
        confirmButtonText: 'Go To Checkout!',
        showCancelButton: true,
      }).then((isConfirm) => {
        if (isConfirm.value) {
          Swal.close();
          $t.router.navigate(['/cart']);
        } else {
          Swal.close();
        }
      });
    };
    $t.sharedService.uiService.showPreConfirmPopMsg('Do You Want To Buy This Bidder', _callback);
  }

  ngOnInit(): void {
    this.getReqDetail();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
