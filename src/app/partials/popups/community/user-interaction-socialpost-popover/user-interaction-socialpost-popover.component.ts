import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-user-interaction-socialpost-popover',
  templateUrl: './user-interaction-socialpost-popover.component.html',
  styleUrls: ['./user-interaction-socialpost-popover.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserInteractionSocialpostPopoverComponent implements OnInit {
	popupData: any;
	allReactions: any = [];
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef <UserInteractionSocialpostPopoverComponent>,
		public sharedService: SharedService
	) { 
		this.popupData = data;
	}

	createAllReactions() {
		let checkAndPush = (_which: any) => {
			if (_which != null) {
				if (_which.length != 0) {
					_which.forEach((x: any) => {
						this.allReactions.push(x);
					});
				}
			}
		}
		checkAndPush(this.popupData.post.countOfLikes);
		checkAndPush(this.popupData.post.countOfClaps);
		checkAndPush(this.popupData.post.countOfCongrats);
		checkAndPush(this.popupData.post.countofCurious);
	}

	ngOnInit(): void {
		console.log(this.popupData);
		this.createAllReactions();
	}

}
