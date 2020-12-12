import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

import { UserInteractionSocialpostPopoverComponent } from '@app/partials/popups/community/user-interaction-socialpost-popover/user-interaction-socialpost-popover.component';

declare var jQuery: any;

@Component({
  selector: 'app-social-posts',
  templateUrl: './social-posts.component.html',
  styleUrls: ['./social-posts.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SocialPostsComponent implements OnInit {
  socialConfig: any = {
    isLoading: true,
    allSocialPost: [],
    newPost: {
      content: '',
      post: true,
      userName: this.user.email,
      userImageUrl: this.user.image,
      videoUrl: '',
      imageUrl: '',
    },
  };
  constructor(public credentialsService: CredentialsService, public sharedService: SharedService, public cdr: ChangeDetectorRef) {}

  // getAllPosts: '/socialPost', // G
  // addSocialPost: '/socialPost', // PO
  // deleteSocialPost: '/post/{postId}', // DE
  // updateSocialPost: '/post', // PU

  getAllSocialPost() {
    this.socialConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.simpleApiCall('getAllPosts');
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

  postComment(msg: any, post: any) {
    let comment: any = {
       id: '',
       userId: this.user.email,
       userName: this.user.firstName + ' ' + this.user.lastName,
       userSummary: '',
       userImageUrl: '',
       content: msg,
       imageUrl: '',
       videoUrl: '',
       comments: [],
       reactions: [],
       countOfLikes: [],
       countOfClaps: [],
       countOfCongrats: [],
       countofCurious: [],
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
       published: true
    }
    // post.comments = [comment];
    // post.post = false;
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Adding Comment...');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('addComment', {
      '{postId}': post.id
    });
    $t.sharedService.configService.post(apiUrl, comment).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Comment Added...');
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
        $t.socialConfig.allSocialPost.push(response.responseObj);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  userInteractionPopover(_event?: any) {
    let $t = this;
    let postInfo = this.socialConfig.allSocialPost.find((m: any) => m.id == _event.srcElement.id);
    let _content = `<div class="rounded-pill py-1">
                  <img src="./assets/images/social/like.svg" class="curPoint pr-1 interactIcon" id="btn-like" title="Like" width="35px">
                  <img src="./assets/images/social/celebrate.svg" class="pr-1 curPoint interactIcon" id="btn-clap" title="Clap" width="35px">
                  <img src="./assets/images/social/celebrate.svg" class="pr-1 curPoint interactIcon" id="btn-congrats" title="Congrats" width="35px">
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
          jQuery('[id="btn-like"]')
            .off()
            .on('click', () => {
              $t.interactionApiCall('like', postInfo);
            });
          jQuery('[id="btn-clap"]')
            .off()
            .on('click', (_event: any) => {
              $t.interactionApiCall('clap', postInfo);
            });
          jQuery('[id="btn-congrats"]')
            .off()
            .on('click', () => {
              $t.interactionApiCall('congrats', postInfo);
            });
          jQuery('[id="btn-curious"]')
            .off()
            .on('click', () => {
              $t.interactionApiCall('curious', postInfo);
            });
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
        top: '50px'
      },
      data : {
        post: _postInfo
      }
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
    let payload = {},
      api;
    let reactionId: string = '';
    if (_postInfo.reactions != null) {
      _postInfo.reactions.forEach((x: any) => {
        if (x.reactionBy == $t.user.email) {
          reactionId = x.id;
        }
      });
    }
    api = _api == undefined ? $t.sharedService.urlService.apiCallWithParams('reactOnPost', {
      '{postId}': _postInfo.id,
    }) : $t.sharedService.urlService.apiCallWithParams('removeReactionFromPost', {
      '{postId}': _postInfo.id,
      '{reactionId}': reactionId
    });
    payload = {
      id: reactionId == '' ? '' : reactionId,
      reactionBy: $t.user.email,
      reactionOn: '',
      reactionType: _reaction,
      reactionByName: $t.user.firstName + ' ' + $t.user.lastName,
      reactionBySummary: '',
      userImageUrl: $t.user.image,
    };
    $t.sharedService.configService.post(api, payload).subscribe(
      (response) => {
        if (_api == 'removeReactionFromPost') {
          let post = $t.socialConfig.allSocialPost.find((x: any) => x.id == _postInfo.id)
          let reaction = post.reactions.find((z: any) => z.id == reactionId);
          $t.socialConfig.allSocialPost[$t.socialConfig.allSocialPost.indexOf(post)].reactions.splice($t.socialConfig.allSocialPost[$t.socialConfig.allSocialPost.indexOf(post)].reactions.indexOf(reaction), 1);
        } else {
          let reaction = $t.socialConfig.allSocialPost.find((x: any) => x.id == _postInfo.id).reactions.find((z: any) => z.id == reactionId);
          reaction == undefined ? $t.socialConfig.allSocialPost.find((x: any) => x.id == _postInfo.id).reactions.push(payload) : reaction.reactionType = _reaction;
        }
        // setTimeout(() => {
        //   $t.getAllSocialPost();
        // }, 1000);
        $t.cdr.detectChanges();
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error);
      }
    );
  }

  deleteComment(_comment: any, _post: any) {
    let $t = this;
    let api = $t.sharedService.urlService.apiCallWithParams('removeComment', {
      '{postId}': _post.id,
      '{commentId}': _comment.id
    });
    $t.sharedService.configService.post(api).subscribe(
      (response: any) => {
        $t.getAllSocialPost();
      },
      (error: any) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error);
      }
    );
  }

  ngOnInit(): void {
    this.getAllSocialPost();
    if (!this.user.image || this.user.image == 'string') {
      this.user.image = 'https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg';
    }
  }
}
