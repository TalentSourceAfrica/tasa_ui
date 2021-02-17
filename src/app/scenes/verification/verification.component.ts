import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss'],
})
export class VerificationComponent implements OnInit {
  qParams: any;
  isLoading:boolean = false;
  isUserVerified:any;
  constructor(private route: ActivatedRoute, public sharedService: SharedService) {
    this.qParams = this.route.snapshot.queryParams;
    console.log(this.qParams);
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
          $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
        },
        (error) => {
          $t.isLoading = false;
          $t.isUserVerified = false;
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    }
  }

  ngOnInit(): void {
    this.verifyEmail();
  }
}
