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
	curious: any = [];
	like: any = [];
	congrats: any = [];
	clap: any = [];

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
		let findAndPush = (_which: any, _where: string) => {
			if (_which != null) {
				if (_which.length != 0) {
					_which.forEach((x: any) => {
						if (x.reactionType == _where) {
							this[_where].push(x);
						}
					});
				}
			}
		}
		checkAndPush(this.popupData.post.reactions);
		findAndPush(this.popupData.post.reactions, 'clap');
		findAndPush(this.popupData.post.reactions, 'like');
		findAndPush(this.popupData.post.reactions, 'congrats');
		findAndPush(this.popupData.post.reactions, 'curious');
		// checkAndPush(this.popupData.post.countOfClaps);
		// checkAndPush(this.popupData.post.countOfCongrats);
		// checkAndPush(this.popupData.post.countofCurious);
	}

	ngOnInit(): void {
		console.log(this.popupData);
		this.createAllReactions();
	}

}
