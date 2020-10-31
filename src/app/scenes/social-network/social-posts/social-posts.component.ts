import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-social-posts',
  templateUrl: './social-posts.component.html',
  styleUrls: ['./social-posts.component.scss'],
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
  posts = [
    {
      id: '',
      userName: 'Avishek Saha',
      userSummary: 'Testing Text',
      userImageUrl: 'https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg',
      content: 'Testing Text',
      imageUrl: '',
      videoUrl: '',
      countOfComments: [''],
      countOfLikes: [
        {
          reactionBy: '',
          reactionOn: '2020-10-29T07:59:44.088Z',
          reactionByName: '',
          reactionBySummary: '',
          userImageUrl: '',
        },
      ],
      countofCurious: [
        {
          reactionBy: '',
          reactionOn: '2020-10-29T07:59:44.088Z',
          reactionByName: '',
          reactionBySummary: '',
          userImageUrl: '',
        },
      ],
      countOfClaps: [
        {
          reactionBy: '',
          reactionOn: '2020-10-29T07:59:44.088Z',
          reactionByName: '',
          reactionBySummary: '',
          userImageUrl: '',
        },
      ],
      countOfCongrats: [
        {
          reactionBy: '',
          reactionOn: '2020-10-29T07:59:44.088Z',
          reactionByName: '',
          reactionBySummary: '',
          userImageUrl: '',
        },
      ],
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
      createdOn: '2020-10-29T07:59:44.088Z',
      updatedBy: '',
      updatedOn: '2020-10-29T07:59:44.088Z',
      published: true,
    },
    {
      id: '',
      userName: 'Anshul Kashyap',
      userSummary: '',
      userImageUrl:
        'https://storage.googleapis.com/tasa-bucket-storage/images/anshul.kashyap03@gmail.com/20200922071537020',
      content: 'asdkjlllllllllllllllllllll aslkjddddddddddddddddddddddddddd asldkjjjjjjjjjjjjjj',
      imageUrl: '',
      videoUrl: '',
      countOfComments: [''],
      countOfLikes: [
        {
          reactionBy: '',
          reactionOn: '2020-10-29T07:59:44.088Z',
          reactionByName: '',
          reactionBySummary: '',
          userImageUrl: '',
        },
      ],
      countofCurious: [
        {
          reactionBy: '',
          reactionOn: '2020-10-29T07:59:44.088Z',
          reactionByName: '',
          reactionBySummary: '',
          userImageUrl: '',
        },
      ],
      countOfClaps: [
        {
          reactionBy: '',
          reactionOn: '2020-10-29T07:59:44.088Z',
          reactionByName: '',
          reactionBySummary: '',
          userImageUrl: '',
        },
      ],
      countOfCongrats: [
        {
          reactionBy: '',
          reactionOn: '2020-10-29T07:59:44.088Z',
          reactionByName: '',
          reactionBySummary: '',
          userImageUrl: '',
        },
      ],
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
      createdOn: '2020-10-29T07:59:44.088Z',
      updatedBy: '',
      updatedOn: '2020-10-29T07:59:44.088Z',
      published: true,
    },
    {
      id: '',
      userName: 'Anshul Kashyap',
      userSummary: '',
      userImageUrl:
        'https://storage.googleapis.com/tasa-bucket-storage/images/anshul.kashyap03@gmail.com/20200922071537020',
      content: 'asdkjlllllllllllllllllllll aslkjddddddddddddddddddddddddddd asldkjjjjjjjjjjjjjj',
      imageUrl: '',
      videoUrl: '',
      countOfComments: [''],
      countOfLikes: [
        {
          reactionBy: '',
          reactionOn: '2020-10-29T07:59:44.088Z',
          reactionByName: '',
          reactionBySummary: '',
          userImageUrl: '',
        },
      ],
      countofCurious: [
        {
          reactionBy: '',
          reactionOn: '2020-10-29T07:59:44.088Z',
          reactionByName: '',
          reactionBySummary: '',
          userImageUrl: '',
        },
      ],
      countOfClaps: [
        {
          reactionBy: '',
          reactionOn: '2020-10-29T07:59:44.088Z',
          reactionByName: '',
          reactionBySummary: '',
          userImageUrl: '',
        },
      ],
      countOfCongrats: [
        {
          reactionBy: '',
          reactionOn: '2020-10-29T07:59:44.088Z',
          reactionByName: '',
          reactionBySummary: '',
          userImageUrl: '',
        },
      ],
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
      createdOn: '2020-10-29T07:59:44.088Z',
      updatedBy: '',
      updatedOn: '2020-10-29T07:59:44.088Z',
      published: true,
    },
  ];

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

  ngOnInit(): void {
    this.getAllSocialPost();
    if (!this.user.image || this.user.image == 'string') {
      this.user.image = 'https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg';
    }
  }
}
