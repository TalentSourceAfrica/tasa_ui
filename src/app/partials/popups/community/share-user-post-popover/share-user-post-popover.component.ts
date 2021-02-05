import { Component, OnInit, ViewEncapsulation, Inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';

import {SharedService} from '@app/services/shared.service';

@Component({
  selector: 'app-share-user-post-popover',
  templateUrl: './share-user-post-popover.component.html',
  styleUrls: ['./share-user-post-popover.component.scss'], 
  encapsulation: ViewEncapsulation.None
})
export class ShareUserPostPopoverComponent implements OnInit {
	@ViewChild('imageShareFileUpload', { static: false }) imageFileUpload: any;
    @ViewChild('videoShareFileUpload', { static: false }) videoFileUpload: any;
	popupData: any;
	newPost: any = {
      content: '',
      post: true,
      userName: '',
      userImageUrl: '',
      userId: '',
      videoUrl: '',
      tasaId: '',
      type: '',
      imageUrl: '',
    };
	isUploadingFile: boolean;
	toggled: boolean = false;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef <ShareUserPostPopoverComponent>,
		public sharedService: SharedService,
		public cdr: ChangeDetectorRef
	) {
		this.popupData = data;
	}

	handleSelection(event: any) {
	    this.newPost.content += ' ' + event.char + ' ';
	}

	createSocialPost() {
		let payload: any = {
		  id: '',
		  userId: this.popupData.user.email,
		  userName: this.popupData.user.firstName + ' ' + this.popupData.user.lastName,
		  userSummary: this.popupData.bio,
		  userImageUrl: this.popupData.user.image,
		  type: this.popupData.user.type,
		  tasaId: this.popupData.user.tasaId,
		  content: this.newPost.content,
		  imageUrl: this.newPost.imageUrl,
		  videoUrl: this.newPost.videoUrl,
		  sharePostId: this.popupData.post.id,
		  sharePostContent: this.popupData.post.content,
		  sharePostImage: this.popupData.post.imageUrl,
		  sharePostVideo: this.popupData.post.videoUrl,
		  comments: [],
		  reactions: [],
		  countOfLikes: 0,
		  countofCurious: 0,
		  countOfClaps: 0,
		  countOfCongrats: 0,
		  createdBy: '',
		  createdOn: '',
		  updatedBy: '',
		  updatedOn: null,
		  published: true,
		  post: true
		}
		// sharedPost = {
		//    tasaId:
		//    imageUrl:
		//    videoUrl:
		//    userName:
		//    createdOn:
		//    content:
		// }
		let additionalUIFields: any = {
			sharePostUserName: this.popupData.post.userName,
			sharePostTasaId: this.popupData.post.tasaId,
			sharePostEmail: this.popupData.post.email,
			sharePostCreatedOn: this.popupData.post.createdOn,
			sharePostOgUserImage: this.popupData.post.userImageUrl
		};
		this.popupData.onSubmit({ payload: payload, additionalUIFields: additionalUIFields });
		this.dialogRef.close();
	}

	getNotiDay(_post: any) {
	    const dateofvisit = this.sharedService.plugins.mom(_post.createdOn);
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

  	uploadFile(_event: any, _case: string) {
	    let $t = this;
	    let isImage = false;
	    let isVideo = false;
	    let isOther = false;
	    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadSingle', { '{email}': $t.popupData.user.email });
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
	        $t.newPost[isImage ? 'imageUrl' : isVideo ? 'videoUrl' : ''] = response.url;
	        $t.isUploadingFile = false;
	      },
	      (error) => {
	        $t.isUploadingFile = false;
	        $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
	      }
	    );
	}

	ngOnInit(): void {
		this.newPost.userName = this.popupData.user.firstName + ' ' + this.popupData.user.lastName;
		this.newPost.userImageUrl = this.popupData.user.image;
		this.newPost.userId = this.popupData.user.email;
		this.newPost.tasaId = this.popupData.user.tasaId;
		this.newPost.type = this.popupData.user.type;
		setTimeout(() => {
			jQuery('#postBox-share').focus();
		}, 500);
	}
}
