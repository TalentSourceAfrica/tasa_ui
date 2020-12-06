import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
      userName: this.user.email,
      userImageUrl: this.user.image,
      videoUrl: '',
      imageUrl: '',
    },
  };
  constructor(public credentialsService: CredentialsService, public sharedService: SharedService) {}

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

  postComment(msg: any) {
    let payload = {
      reactionBy: this.user.email,
      reactionByName: this.user.firstName + ' ' + this.user.lastName,
      reactionBySummary: msg,
      userImageUrl: this.user.image,
    };
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Adding Comment...');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('addComment');
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
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
              $t.interactionApiCall('likePost', postInfo);
            });
          jQuery('[id="btn-clap"]')
            .off()
            .on('click', (_event: any) => {
              $t.interactionApiCall('clapPost', postInfo);
            });
          jQuery('[id="btn-congrats"]')
            .off()
            .on('click', () => {
              $t.interactionApiCall('congratsPost', postInfo);
            });
          jQuery('[id="btn-curious"]')
            .off()
            .on('click', () => {
              $t.interactionApiCall('curiousPost', postInfo);
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

  isReacted(_which: string, _post: any) {
    let isLikePresent = undefined, isClapPresent = undefined, isCongratsPresent = undefined;
    switch(_which) {
      case 'like':
        if (_post.countOfLikes != null) {
          isLikePresent = _post.countOfLikes.filter((d: any) => {
            return d.reactionBy == this.user.email;
          });
        } else {
          return false
        }
        return (isLikePresent != undefined ? true : false);
        break;
      case 'clap':
        if (_post.countOfClaps != null) {
          isClapPresent = _post.countOfClaps.filter((d: any) => {
            return d.reactionBy == this.user.email;
          });
        } else {
          return false;
        }
        return (isClapPresent != undefined ? true : false);
        break;
      case 'congrats':
        if (_post.countOfCongrats != null) {
          isCongratsPresent = _post.countOfCongrats.filter((d: any) => {
            return d.reactionBy == this.user.email;
          });
        } else {
          return false;
        }
        return (isCongratsPresent != undefined ? true : false);
        break;    
    }
  }

  interactionApiCall(_api: string, _postInfo: any) {
    let $t = this;
    let payload = {},
      api;
    api = $t.sharedService.urlService.apiCallWithParams(_api, {
      '{postId}': _postInfo.id,
    });
    payload = {
      id: _postInfo.id,
      reactionBy: $t.user.email,
      reactionOn: '',
      reactionByName: $t.user.firstName + ' ' + $t.user.lastName,
      reactionBySummary: '',
      userImageUrl: $t.user.image,
    };
    $t.sharedService.configService.post(api, payload).subscribe(
      (response) => {
        $t.getAllSocialPost();
      },
      (error) => {
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
