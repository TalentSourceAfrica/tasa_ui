import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

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
    let isClapPresent = undefined,
      isCongratsPresent = undefined,
      isCuriousPresent = undefined;
    let _content = `<div class="rounded-pill">`;
    _content +=
      _event.currentTarget.children[0].id === 'liked'
        ? `<img src="./assets/images/social/like.svg" class="curPoint pr-1 zoomCard interactIcon" id="btn-dislike" title="Remove Like">`
        : `<img src="./assets/images/social/like.svg" class="curPoint pr-1 zoomCard interactIcon" id="btn-like" title="Like">`;
    if (postInfo.countOfClaps != null) {
      isClapPresent = postInfo.countOfClaps.filter((d: any) => d.reactionBy === $t.user.email);
    }
    if (postInfo.countOfCongrats != null) {
      isCongratsPresent = postInfo.countOfCongrats.filter((d: any) => d.reactionBy === $t.user.email);
    }
    _content +=
      isClapPresent !== undefined
        ? `<img src="./assets/images/social/celebrate.svg" class="zoomCard pr-1 curPoint interactIcon" id="btn-unclap" title="Remove Clap">`
        : `<img src="./assets/images/social/celebrate.svg" class="zoomCard pr-1 curPoint interactIcon" id="btn-clap" title="Clap">`;
    _content +=
      isCongratsPresent !== undefined
        ? `<img src="./assets/images/social/congrats.svg" class="zoomCard pr-1 curPoint interactIcon" id="btn-removeCongrats" title="Remove Congrats">`
        : `<img src="./assets/images/social/congrats.svg" class="zoomCard pr-1 curPoint interactIcon" id="btn-congrats" title="Congrats">`;
    _content +=
      isCuriousPresent !== undefined
        ? `<img src="./assets/images/social/curious.svg" class="zoomCard pr-1 curPoint interactIcon" id="btn-notCurious" title="Remove Curious">`
        : `<img src="./assets/images/social/curious.svg" class="zoomCard pr-1 curPoint interactIcon" id="btn-curious" title="Curious">`;
    _content += `</div>`;
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
        width: '240',
        offsetLeft: 50,
        onShow: function ($element: any) {
          jQuery('[id="btn-like"]')
            .off()
            .on('click', () => {
              $t.interactionApiCall('likePost', postInfo);
            });
          jQuery('[id="btn-dislike"]')
            .off()
            .on('click', () => {
              $t.interactionApiCall('removeLikePost', postInfo);
            });
          jQuery('[id="btn-clap"]')
            .off()
            .on('click', (_event: any) => {
              $t.interactionApiCall('clapPost', postInfo);
            });
          jQuery('[id="btn-unclap"]')
            .off()
            .on('click', () => {
              $t.interactionApiCall('removeClapPost', postInfo);
            });
          jQuery('[id="btn-congrats"]')
            .off()
            .on('click', () => {
              $t.interactionApiCall('congratsPost', postInfo);
            });
          jQuery('[id="btn-removeCongrats"]')
            .off()
            .on('click', () => {
              $t.interactionApiCall('removeCongratsPost', postInfo);
            });
          jQuery('[id="btn-curious"]')
            .off()
            .on('click', () => {
              $t.interactionApiCall('curiousPost', postInfo);
            });
          jQuery('[id="btn-notCurious"]')
            .off()
            .on('click', () => {
              $t.interactionApiCall('removeCuriousPost', postInfo);
            });
        },
      });
      jQuery('#' + _event.srcElement.id).webuiPopover('show');
    }, 500);
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
      reactionByName: $t.user.firstName + $t.user.lastName,
      reactionBySummary: '',
      userImageUrl: '',
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
