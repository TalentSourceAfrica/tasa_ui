import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { CredentialsService } from '@app/auth';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
})
export class TestimonialsComponent implements OnInit {
  postData: any = [];
  isAdmin: boolean = false;
  constructor(public sharedService: SharedService, public credentialsService: CredentialsService) {
    this.user.type.toLowerCase() == 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
  }

  addPost() {
    this.postData.push({
      id: '',
      name: this.user.firstName + ' ' + this.user.lastName,
      image: this.user.image,
      review: '',
      courseName: '',
      mentorName: '',
      rating: 0,
      ratingTotal: 5,
      orgPlaced: '',
      jobLocation: '',
      status: '',
      createdOn: '',
      updatedOn: '',
      updatedBy: '',
    });
  }

  removeFeature(tier: any, featIndex: any) {
    tier.feature.splice(featIndex, 1);
  }

  postAction(post: any, status: string) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Changing Status...!');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('changePostStatus', {
      '{postId}': post.id,
      '{status}': status,
    });
    post.status = 'Submitted';
    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        post.status = status;
        $t.sharedService.uiService.showApiSuccessPopMsg('Status Changed...!');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  savePost(post: any, postIndex: number) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Adding Post...!');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('addPost');
    $t.sharedService.configService.post(apiUrl, post).subscribe(
      (response: any) => {
        $t.postData[postIndex] = response;
        $t.sharedService.uiService.showApiSuccessPopMsg('Post Added...!');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  updatePost(post: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Updating Post...!');
    post.status = 'Submitted';
    post.image = this.user.image;
    post.name = this.user.firstName + ' ' + this.user.lastName;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('updatePost');

    $t.sharedService.configService.put(apiUrl, post).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Post Updated...!');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  deletePost(post: any, postIndex: any) {
    let $t = this;
    if (post.id != '') {
      $t.sharedService.uiService.showApiStartPopMsg('Deleting Post...!');
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('deletePost', { '{postId}': post.id });
      $t.sharedService.configService.delete(apiUrl).subscribe(
        (response: any) => {
          $t.postData.splice(postIndex, 1);
          $t.sharedService.uiService.showApiSuccessPopMsg('Post Deleted...!');
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    } else {
      $t.postData.splice(postIndex, 1);
    }
  }

  getPosts() {
    let $t = this;
    let apiUrl = '';
    if ($t.isAdmin) {
      apiUrl = $t.sharedService.urlService.simpleApiCall('getAdminPosts');
    } else {
      apiUrl = $t.sharedService.urlService.simpleApiCall('getPostByUser');
    }

    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.postData = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    this.getPosts();
  }
}
