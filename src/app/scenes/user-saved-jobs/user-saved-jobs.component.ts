import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-user-saved-jobs',
  templateUrl: './user-saved-jobs.component.html',
  styleUrls: ['./user-saved-jobs.component.scss'],
})
export class UserSavedJobsComponent implements OnInit {
  allJobs: any = [];
  currentView = 1;
  constructor(
    public credentialsService: CredentialsService,
    public sharedService: SharedService,
    public authenticationService: AuthenticationService,
    public router: Router
  ) {
    this.allJobs = this.user.savedJobs;
  }

  viewJob(jobId: any) {
    this.router.navigate(['/job/' + jobId], { replaceUrl: true });
  }

  changeAssetView(_view: number) {
    this.currentView = _view;
    setTimeout(() => {
      if (this.currentView === 1) {
      } else if (this.currentView === 2) {
      }
    }, 1);
  }

  removeSaveJobs(job: any, event: any) {
    event.stopPropagation();
    event.preventDefault();
    let $t = this;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('saveJob', {
      '{userId}': $t.user.email,
      '{jobId}': job.id,
    });
    $t.sharedService.uiService.showApiStartPopMsg('Removing Job...');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        if ($t.user) {
          $t.user['savedJobs'] = $t.user['savedJobs'].filter((d: any) => d.id !== job.id);
          $t.allJobs = $t.user['savedJobs'];
          $t.authenticationService.login(this.user);
        }
        $t.sharedService.uiService.showApiSuccessPopMsg('Job Removed...');
      },
      (error) => {
        console.log(error);
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {}

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
