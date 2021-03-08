import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

import { UserInteractionSocialpostPopoverComponent } from '@app/partials/popups/community/user-interaction-socialpost-popover/user-interaction-socialpost-popover.component';
import { ShareUserPostPopoverComponent } from '@app/partials/popups/community/share-user-post-popover/share-user-post-popover.component';
import { ShareArticlePopupComponent } from '@app/partials/popups/community/share-article-popup/share-article-popup.component';
import { Gallery } from 'angular-gallery';
import Swal from 'sweetalert2';

declare var jQuery: any;

@Component({
  selector: 'app-social-posts',
  templateUrl: './social-posts.component.html',
  styleUrls: ['./social-posts.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SocialPostsComponent implements OnInit {
  @ViewChild('conectionDrawer', { static: false }) conectionDrawer: any;
  @ViewChild('imageFileUpload', { static: false }) imageFileUpload: any;
  @ViewChild('videoFileUpload', { static: false }) videoFileUpload: any;
  socialConfig: any = {
    isLoading: false,
    allSocialPost: [],
    newPost: {
      content: '',
      post: true,
      userName: this.user.firstName + ' ' + this.user.lastName,
      userImageUrl: this.user.image,
      userId: this.user.email,
      videoUrl: '',
      tasaId: this.user.tasaId,
      type: this.user.type,
      imageUrl: '',
      field1:'',
    },
    sharedPosts: [],
  };
  postFilter: any = [
    { value: 0, viewValue: 'All Post' },
    { value: 1, viewValue: 'My Post' },
    { value: 2, viewValue: 'My Activity' },
  ];
  selectedPostFilter: number = 0;
  toggled: boolean = false;
  isUploadingFile: boolean = false;
  hoverTimer: any;
  isUsPopSeen: boolean = false;
  constructor(
    public credentialsService: CredentialsService,
    public sharedService: SharedService,
    public cdr: ChangeDetectorRef,
    private gallery: Gallery
  ) {}

  openSharePostPopup(_post: any) {
    let $t = this;
    $t.sharedService.dialogService.open(ShareUserPostPopoverComponent, {
      width: '50%',
      position: {
        top: '75px',
      },
      data: {
        post: _post,
        user: $t.user,
        onSubmit: (fromDialog: any) => {
          $t.sharePost(fromDialog);
        },
      },
    });
  }

  openShareArticlePopup(_post: any) {
    let $t = this;
    $t.sharedService.dialogService.open(ShareArticlePopupComponent, {
      width: '60%',
      position: {
        top: '75px',
      },
      data: {
        post: _post,
        user: $t.user,
        onSubmit: (fromDialog: any) => {
          console.log(fromDialog);
          // $t.sharePost(fromDialog);
        },
      },
    });
  }

  sharePost(_fromDialog: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Sharing Post...');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('sharePost', {
      '{postId}': _fromDialog.payload.sharePostId,
    });
    $t.sharedService.configService.post(apiUrl, _fromDialog.payload).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Post Shared...');
        let newObj = { ...response.responseObj, ..._fromDialog.additionalUIFields };
        $t.socialConfig.allSocialPost.unshift(JSON.parse(JSON.stringify(newObj)));
        jQuery('#postsListing').animate({ scrollTop: 0 }, 'slow');
        $t.sharedService.utilityService.changeMessage('TRIGGER-HEADER-NOTIFICATIONS-UPDATE');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  onPostTypeChange() {
    switch (this.selectedPostFilter) {
      case 0:
        this.getAllSocialPost();
        break;
      case 1:
        this.getUserSpecificPost();
        break;
      case 2:
        this.getUserActivity();
        break;
    }
  }

  getAllSocialPost() {
    this.socialConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.simpleApiCall('getAllPosts');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.socialConfig.allSocialPost = JSON.parse(JSON.stringify(response.responseObj));
        this.socialConfig.isLoading = false;
        this.handleSharedPostInfo(this.socialConfig.allSocialPost);
      },
      (error) => {
        this.socialConfig.isLoading = false;
        this.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  handleSharedPostInfo(_allPosts: any) {
    let additionalFields = (_source: any, _matched: any) => {
      _source['sharePostUserName'] = _matched.userName;
      _source['sharePostTasaId'] = _matched.tasaId;
      _source['sharePostEmail'] = _matched.userId;
      _source['sharePostCreatedOn'] = _matched.createdOn;
      _source['sharePostOgUserImage'] = _matched.userImageUrl;
    };

    _allPosts.forEach((x: any) => {
      x.sharePostId != '' ? this.socialConfig.sharedPosts.push(x) : '';
    });
    this.socialConfig.sharedPosts.forEach((x: any, xi: number) => {
      let post = x;
      let found: boolean = false;
      _allPosts.forEach((z: any) => {
        if (z.id == post.sharePostId) {
          found = true;
          additionalFields(post, z);
        }
      });
      if (!found) {
        let callBack = (response: any) => {
          additionalFields(post, response);
        };
        this.fetchPostById(post.sharePostId, callBack);
      }
      this.socialConfig.allSocialPost.forEach((po: any, i: number) => {
        if (po.id == post.id) {
          po = JSON.parse(JSON.stringify(post));
        }
      });
    });
    this.socialConfig.isLoading = false;
  }

  fetchPostById(_id: any, _callback: any) {
    let $t = this;
    let api = $t.sharedService.urlService.apiCallWithParams('getPostById', {
      '{postId}': _id,
    });
    $t.sharedService.configService.get(api).subscribe(
      (response: any) => {
        _callback(response);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error);
      }
    );
  }

  getUserSpecificPost() {
    this.socialConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getPostsByUser', {
      '{userId}': this.user.email,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.socialConfig.allSocialPost = response.responseObj;
        this.socialConfig.isLoading = false;
      },
      (error) => {
        this.sharedService.uiService.showApiErrorPopMsg(error);
      }
    );
  }

  getUserActivity() {
    this.socialConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getActivityPostByUser', {
      '{userId}': this.user.email,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.socialConfig.allSocialPost = response.responseObj;
        this.socialConfig.isLoading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addEmoji(event: any) {
    this.socialConfig.newPost.content += ' ' + event.emoji.native + ' ';
    this.toggled = false;
  }

  postComment(msg: any, post: any, _comment?: any) {
    let comment: any = {
      id: '',
      userId: this.user.email,
      userName: this.user.firstName + ' ' + this.user.lastName,
      userSummary: this.user.currentRole + ' At ' + this.user.organization,
      userImageUrl: this.user.image,
      tasaId: this.user.tasaId,
      type: this.user.type,
      content: msg,
      imageUrl: '',
      videoUrl: '',
      comments: [],
      reactions: [],
      countOfLikes: 0,
      countOfClaps: 0,
      countOfCongrats: 0,
      countofCurious: 0,
      field1: '',
      field2: '',
      field3: '',
      field4: '',
      field5: '',
      field6: '',
      field7: '',
      field8: '',
      field9: '',
      field10: '',
      field11: '',
      field12: '',
      field13: '',
      field14: '',
      field15: '',
      field16: '',
      field17: '',
      field18: '',
      field19: '',
      field20: '',
      createdBy: '',
      createdOn: '',
      updatedBy: '',
      updatedOn: '',
      post: false,
      published: true,
    };
    // post.comments = [comment];
    // post.post = false;
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('addComment', {
      '{postId}': post.id,
    });
    $t.sharedService.configService.post(apiUrl, comment).subscribe(
      (response: any) => {
        (post.comments == null || post.comments.length) ? (post.comments = []) : '';
        response.responseObj.comments.forEach((d: any) => {
          d['isCommentShow'] = true;
          post.comments.push(d);
        });
        jQuery('#commentBox').val('');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  createSocialPost() {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Creating Post...');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('addSocialPost');
    $t.sharedService.configService.post(apiUrl, $t.socialConfig.newPost).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Post Added...');
        $t.socialConfig.allSocialPost.unshift(JSON.parse(JSON.stringify(response.responseObj)));
        jQuery('#postBox').val('');
        $t.socialConfig.newPost.content = '';
        $t.socialConfig.newPost.imageUrl = '';
        $t.socialConfig.newPost.videoUrl = '';
        $t.sharedService.utilityService.changeMessage('TRIGGER-HEADER-NOTIFICATIONS-UPDATE');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  deletePost(postId: string, postIndex: Number) {
    let $t = this;
    let _callBack = () => {
      $t.sharedService.uiService.showApiStartPopMsg('Deleting Post...');
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('deletePost', { '{postId}': postId });
      $t.sharedService.configService.delete(apiUrl).subscribe(
        (response: any) => {
          $t.socialConfig.allSocialPost.splice(postIndex, 1);
          $t.sharedService.uiService.closePopMsg();
          $t.sharedService.utilityService.changeMessage('TRIGGER-HEADER-NOTIFICATIONS-UPDATE');
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    };
    $t.sharedService.uiService.showPreConfirmPopMsg('Are you sure you want to delete this post ?', _callBack);
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  userInterationMouseEnter(_event: any) {
    let $t = this;
    $t.hoverTimer = setTimeout(() => {
      $t.userInteractionPopover(_event);
    }, 1000);
  }

  userIntearctionMouseLeave(_event: any) {
    let $t = this;
    clearTimeout($t.hoverTimer);
    let destroyPop = () => {
      jQuery('#' + _event.srcElement.id).webuiPopover('destroy');
    };

    if ($t.isUsPopSeen) {
      setTimeout(() => {
        destroyPop();
      }, 3000);
    } else {
      destroyPop();
    }
  }

  userInteractionPopover(_event?: any, _comment?: any) {
    let $t = this;
    let postInfo =
      _comment == undefined ? this.socialConfig.allSocialPost.find((m: any) => m.id == _event.srcElement.id) : _comment;
    let _content = `<div class="rounded-pill py-1">
                  <img src="./assets/images/social/like.svg" class="curPoint pr-1 interactIcon" id="btn-like" title="Like" width="35px">
                  <img src="./assets/images/social/celebrate.svg" class="pr-1 curPoint interactIcon" id="btn-clap" title="Clap" width="35px">
                  <img src="./assets/images/social/congrats.svg" class="pr-1 curPoint interactIcon" id="btn-congrats" title="Congrats" width="35px">
                  <img src="./assets/images/social/curious.svg" class="pr-1 curPoint interactIcon" id="btn-curious" title="Curious" width="35px">
                </div>`;
    setTimeout(() => {
      jQuery('#' + _event.srcElement.id).webuiPopover({
        trigger: 'hover',
        animation: 'pop',
        type: 'html',
        multi: false,
        content: _content,
        arrow: false,
        closeable: false,
        placement: 'bottom',
        width: '185',
        offsetLeft: 60,
        onShow: function ($element: any) {
          jQuery('#' + $element[0].id).css('border-radius', '50rem');
          $t.isUsPopSeen = true;
          jQuery('[id="btn-like"]')
            .off()
            .on('click', () => {
              _comment == undefined
                ? $t.interactionApiCall('like', postInfo)
                : $t.interactionInInteractionApiCall('like', postInfo);
            });
          jQuery('[id="btn-clap"]')
            .off()
            .on('click', (_event: any) => {
              _comment == undefined
                ? $t.interactionApiCall('clap', postInfo)
                : $t.interactionInInteractionApiCall('clap', postInfo);
            });
          jQuery('[id="btn-congrats"]')
            .off()
            .on('click', () => {
              _comment == undefined
                ? $t.interactionApiCall('congrats', postInfo)
                : $t.interactionInInteractionApiCall('congrats', postInfo);
            });
          jQuery('[id="btn-curious"]')
            .off()
            .on('click', () => {
              _comment == undefined
                ? $t.interactionApiCall('curious', postInfo)
                : $t.interactionInInteractionApiCall('curious', postInfo);
            });
        },
        onHide: function ($element: any) {
          jQuery($element).remove();
          $t.isUsPopSeen = false;
        },
      });
      jQuery('#' + _event.srcElement.id).webuiPopover('show');
    }, 500);
  }

  openUserInteractionPopover(_postInfo: any) {
    let $t = this;
    $t.sharedService.dialogService.open(UserInteractionSocialpostPopoverComponent, {
      width: '25%',
      position: {
        top: '50px',
      },
      data: {
        post: _postInfo,
      },
    });
  }

  isReactionPresent(_which: string, _post: any) {
    let reaction = undefined;
    if (_post.reactions != null) {
      _post.reactions.forEach((x: any) => {
        if (x.reactionType == _which) {
          reaction = true;
        }
      });
    }
    return reaction == undefined ? false : true;
  }

  isReacted(_which: string, _post: any) {
    let isReacted = undefined;
    if (_post.reactions != null) {
      _post.reactions.forEach((x: any) => {
        if (x.reactionBy == this.user.email && x.reactionType == _which) {
          isReacted = true;
        }
      });
    }
    return isReacted == undefined ? false : true;
  }

  noOtherReactionPresent(_post: any) {
    let reactionArray: any = [];
    reactionArray.push(this.isReacted('clap', _post));
    reactionArray.push(this.isReacted('congrats', _post));
    reactionArray.push(this.isReacted('curious', _post));
    if (reactionArray.indexOf(true) == -1) {
      if (this.isReacted('like', _post)) {
        return true;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  interactionApiCall(_reaction: string, _postInfo: any, _api?: string) {
    let $t = this;
    let obj = $t.createPayloadAndApi(_reaction, _postInfo, _api);
    $t.sharedService.configService.post(obj.api, obj.payload).subscribe(
      (response) => {
        if (_api == 'removeReactionFromPost') {
          let post = $t.socialConfig.allSocialPost.find((x: any) => x.id == _postInfo.id);
          let reaction = post.reactions.find((z: any) => z.id == obj.payload.reactionId);
          $t.socialConfig.allSocialPost[$t.socialConfig.allSocialPost.indexOf(post)].reactions.splice(
            $t.socialConfig.allSocialPost[$t.socialConfig.allSocialPost.indexOf(post)].reactions.indexOf(reaction),
            1
          );
        } else {
          _postInfo.reactions == null ? (_postInfo.reactions = []) : '';
          let reaction = $t.socialConfig.allSocialPost
            .find((x: any) => x.id == _postInfo.id)
            .reactions.find((z: any) => z.id == obj.payload.id);
          reaction == undefined
            ? $t.socialConfig.allSocialPost.find((x: any) => x.id == _postInfo.id).reactions.push(obj.payload)
            : (reaction.reactionType = _reaction);
        }
        $t.sharedService.utilityService.changeMessage('TRIGGER-HEADER-NOTIFICATIONS-UPDATE');
        $t.cdr.detectChanges();
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error);
      }
    );
  }

  interactionInInteractionApiCall(_reaction: string, _postInfo: any, _api?: string) {
    let $t = this;
    let obj = $t.createPayloadAndApi(_reaction, _postInfo, _api);
    $t.sharedService.configService.post(obj.api, obj.payload).subscribe(
      (response) => {
        if (_api == 'removeReactionFromPost') {
          let reaction = _postInfo.reactions.find((z: any) => z.id == obj.payload.reactionId);
          _postInfo.reactions.splice(_postInfo.reactions.indexOf(obj.payload), 1);
        } else {
          _postInfo.reactions == null ? (_postInfo.reactions = []) : '';
          let isPresent = _postInfo.reactions.find((x: any) => x.id == obj.payload.id);
          isPresent == undefined ? _postInfo.reactions.push(obj.payload) : (isPresent.reactionType = _reaction);
        }
        $t.sharedService.utilityService.changeMessage('TRIGGER-HEADER-NOTIFICATIONS-UPDATE');
        $t.cdr.detectChanges();
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error);
      }
    );
  }

  createPayloadAndApi(_reaction: string, _postInfo: any, _api?: string) {
    let $t = this;
    let payload: any = {},
      api;
    let reactionId: string = '';
    if (_postInfo.reactions != null) {
      _postInfo.reactions.forEach((x: any) => {
        if (x.reactionBy == $t.user.email) {
          reactionId = x.id;
        }
      });
    }
    api =
      _api == undefined
        ? $t.sharedService.urlService.apiCallWithParams('reactOnPost', {
            '{postId}': _postInfo.id,
          })
        : $t.sharedService.urlService.apiCallWithParams('removeReactionFromPost', {
            '{postId}': _postInfo.id,
            '{reactionId}': reactionId,
          });
    payload = {
      id: reactionId == '' ? $t.uuidv4Generator() : reactionId,
      reactionBy: $t.user.email,
      reactionOn: '',
      tasaId: $t.user.tasaId,
      type: $t.user.type,
      userId: $t.user.email,
      reactionType: _reaction,
      reactionByName: $t.user.firstName + ' ' + $t.user.lastName,
      reactionBySummary: $t.user.currentRole + ' At ' + $t.user.organization,
      userImageUrl: $t.user.image,
    };
    return {
      api: api,
      payload: payload,
    };
  }

  uuidv4Generator() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  deleteComment(_comment: any, _post: any) {
    let $t = this;
    let api = $t.sharedService.urlService.apiCallWithParams('removeComment', {
      '{postId}': _post.id,
      '{commentId}': _comment.id,
    });
    $t.sharedService.configService.post(api).subscribe(
      (response: any) => {
        _post.comments.splice(_post.comments.indexOf(_comment), 1);
        $t.sharedService.utilityService.changeMessage('TRIGGER-HEADER-NOTIFICATIONS-UPDATE');
      },
      (error: any) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error);
      }
    );
  }

  getNotiDay(_date: any) {
    const dateofvisit = this.sharedService.plugins.mom(_date);
    const today = this.sharedService.plugins.mom();
    const day = today.diff(dateofvisit, 'days');
    if (day === 0) {
      return 'Today';
    } else if (day === 1) {
      return day + ' day ago';
    } else {
      return day + ' days ago';
    }
  }

  triggerImageUpload() {
    this.imageFileUpload.nativeElement.click();
  }

  triggerVideoUpload() {
    this.videoFileUpload.nativeElement.click();
  }

  triggerAddLink() {
    let $t = this;
    Swal.fire({
      title: 'Add Link',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        placeholder: 'Link',
      },
      showCancelButton: true,
      confirmButtonText: 'Add',
      confirmButtonClass: 'rounded-pill shadow-sm',
      cancelButtonClass: 'rounded-pill shadow-sm',
      showLoaderOnConfirm: true,
      preConfirm: (data) => {
        if (data === '') {
          Swal.showValidationMessage('Please Enter Link');
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result) {
        if (result.dismiss) {
          Swal.close();
        }
        if (result.value) {
          $t.socialConfig.newPost.field1 = result.value;
        }
      }
    });
  }

  uploadFile(_event: any, _case: string) {
    let $t = this;
    let isImage = false;
    let isVideo = false;
    let isOther = false;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadSingle', { '{email}': $t.user.email });
    let files = _event.target.files;
    var form = new FormData();
    let imageTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
    let videoTypes = ['video/mp4', 'video/mov', 'video/wmv', 'video/flv', 'video/avi', 'video/webm'];
    if (_case == 'image') {
      if (imageTypes.indexOf(files[0].type) != -1) {
        isImage = true;
      } else {
        $t.sharedService.uiService.showApiErrorPopMsg(
          'Incorrect file chosen, please choose an image (.jpeg, .jpg, .gif, .png)'
        );
        return;
      }
    } else {
      if (videoTypes.indexOf(files[0].type) != -1) {
        isVideo = true;
      } else {
        $t.sharedService.uiService.showApiErrorPopMsg(
          'Incorrect file chosen, please choose a video (.mp4, .mov, .wmv, .flv, .avi, .webm)'
        );
        return;
      }
    }
    $t.isUploadingFile = true;
    form.append('file', files[0], files[0].name);
    $t.sharedService.configService.post(apiUrl, form).subscribe(
      (response: any) => {
        $t.socialConfig.newPost[isImage ? 'imageUrl' : isVideo ? 'videoUrl' : ''] = response.url;
        $t.isUploadingFile = false;
      },
      (error) => {
        $t.isUploadingFile = false;
        $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
      }
    );
  }

  fetchComments(_comment: any, _iteration: Number) {
    let $t = this;
    // if (_comment.comments.length != 0) {
    //   _comment.isCommentShow = !_comment.isCommentShow;
    // } else {
    let api = $t.sharedService.urlService.apiCallWithParams('getPostById', {
      '{postId}': _comment.id,
    });
    $t.sharedService.configService.get(api).subscribe(
      (response: any) => {
        response.responseObj.comments.forEach((d: any) => {
          _comment.comments.push(d);
        });
        _comment.isCommentShow = !_comment.isCommentShow;
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error);
      }
    );
    // }
  }

  showProfilePic(doc: any, index: number) {
    let prop: any = {
      images: [{ path: doc.image }],
      index,
      transitionDuration: 500,
      transitionTimingFunction: 'ease-in',
      arrows: false,
    };
    this.gallery.load(prop);
  }

  ngOnInit(): void {
    this.getAllSocialPost();
    if (!this.user.image || this.user.image == 'string') {
      this.user.image = 'https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg';
    }
  }
  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
    // this.conectionDrawer.open();
    // setTimeout(() => {
    //   jQuery('.notification-popup').click((event: any) => {
    //     jQuery(this).toggleClass('open');
    //     jQuery('#notificationMenu').removeClass('d-none').addClass('open');
    //   });
    //   jQuery(document).on('click', (event: any) => {
    //     if (!jQuery(event.target).closest('.notification-popup').length) {
    //       if (jQuery('#notificationMenu').hasClass('open')) {
    //         jQuery('#notificationMenu').addClass('d-none').removeClass('open');
    //       }
    //     }
    //   });
    // }, 3000);
    jQuery('#main-nav').stellarNav({
      theme: 'dark',
      breakpoint: 900,
    });
    this.cdr.detectChanges();
  }
}
