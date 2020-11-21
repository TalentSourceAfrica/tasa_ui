import { Component, OnInit } from '@angular/core';

import { SharedService } from '@app/services/shared.service';
import { CredentialsService } from '@app/auth';

@Component({
  selector: 'app-jobs-admin',
  templateUrl: './jobs-admin.component.html',
  styleUrls: ['./jobs-admin.component.scss']
})
export class JobsAdminComponent implements OnInit {
	isLoading: boolean = false;
	allJobs: any = [];
	pageSize = 100;

	constructor(
		public sharedService: SharedService,
		public credentialsService: CredentialsService
	) { }

	changeJobStatus(_job: any, _statusToSet: string) {
		let $t = this;
		$t.sharedService.uiService.showApiStartPopMsg('Updating Status...');
		let apiUrl = $t.sharedService.urlService.apiCallWithParams('updateJob', {
			'{jobId}': _job.id
		});
		_job.status = _statusToSet;
		$t.sharedService.configService.put(apiUrl, _job).subscribe(
			(response: any) => {
				$t.sharedService.uiService.showApiSuccessPopMsg('Status Updated..!');
				$t.getJobs(1);
			},
			error => {
				$t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
			}
		);
	}

	getJobs(_pageIndex: any) {
		this.isLoading = true;
		let apiUrl = this.sharedService.urlService.apiCallWithParams('getRecruiterPostedJobs', {
		  '{recruiterId}': this.user.email,
		  '{status}': 'All',
		  '{page}': 1,
		  '{size}': this.pageSize,
		});
		this.sharedService.configService.get(apiUrl).subscribe(
		  (response: any) => {
		    this.allJobs = response.responseObj;
		    this.isLoading = false;
		    setTimeout(() => {
		      jQuery('.floating-actions .action').toggleClass('visible');
		    }, 1000);
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
		this.getJobs(1);
	}

}
