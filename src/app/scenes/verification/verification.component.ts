import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent implements OnInit {
  qParams: any;
  isLoading: boolean = false;
  isUserVerified: any;
  apiMessage: string = '';
  constructor(
    private route: ActivatedRoute,
    public sharedService: SharedService,
    private authenticationService: AuthenticationService
  ) {
    this.qParams = this.route.snapshot.queryParams;
  }

  verifyEmail() {
    let $t = this;
    if ($t.qParams.hash) {
      $t.isLoading = true;
      $t.sharedService.uiService.showApiStartPopMsg('Verifying...');
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('verifyEmail', {
        '{hash}': $t.qParams.hash,
      });
      $t.sharedService.configService.get(apiUrl).subscribe(
        (response: any) => {
          $t.isLoading = false;
          $t.isUserVerified = true;
          $t.apiMessage = response.message;
          $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
        },
        (error) => {
          $t.isLoading = false;
          $t.isUserVerified = false;
          $t.apiMessage = error.error.message;
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    }
  }

  login() {
    this.authenticationService.openSignupPopup('sign-in');
  }

  ngOnInit(): void {
    this.verifyEmail();
  }
}
