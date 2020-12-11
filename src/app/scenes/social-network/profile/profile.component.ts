import { Component, OnInit, ViewChild } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('conectionDrawer', { static: false }) conectionDrawer: any;
  public allUsers: any = [];
  constructor(public credentialsService: CredentialsService, private sharedService: SharedService) {}
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

  getAllusers() {
    let apiUrl = this.sharedService.urlService.simpleApiCall('getUsers');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response) => {
        this.allUsers = response;
      },
      (error) => {}
    );
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    this.getAllusers();
    if (!this.user.image || this.user.image == 'string') {
      this.user.image = 'https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg';
    }
  }
  ngAfterViewInit(): void {
    this.conectionDrawer.toggle();
  }
}
