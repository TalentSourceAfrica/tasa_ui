import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { Logger, untilDestroyed } from '@core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// service
import { SharedService } from '@app/services/shared.service';
import { finalize } from 'rxjs/operators';
//extra
declare var jQuery: any;

const log = new Logger('Login');

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss'],
})
export class LoginPopupComponent implements OnInit {
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;
  popupData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<LoginPopupComponent>,
    private sharedService: SharedService
  ) {
    this.popupData = data;
    this.createForm();
  }

  login() {
    this.isLoading = true;
    this.sharedService.uiService.showApiStartPopMsg('Logging you in...');
    let apiUrl = this.sharedService.urlService.simpleApiCall('login');
    this.sharedService.configService
      .post(apiUrl, this.loginForm.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (response: any) => {
          this.popupData.authenticationService.login(response.responseObj);
          this.popupData.authenticationService.setToken(JSON.parse(response.data).access_token);
          this.sharedService.uiService.closePopMsg();
          this.dialogRef.close();
          this.router.navigate(['/dashboard'], { replaceUrl: true });
          setTimeout(() => {
            jQuery('.dashboard-wrapper').addClass('margin-top-100-px');
          }, 500);
        },
        (error) => {
          this.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    // login$
    //   .pipe(
    //     finalize(() => {
    //       this.loginForm.markAsPristine();
    //       this.isLoading = false;
    //     }),
    //     untilDestroyed(this)
    //   )
    //   .subscribe(
    //     (credentials: any) => {
    //       log.debug(`${credentials.username} successfully logged in`);
    //       this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
    //     },
    //     (error: any) => {
    //       log.debug(`Login error: ${error}`);
    //       this.error = error;
    //     }
    //   );
  }

  forgotPass() {
    this.dialogRef.close();
    this.popupData.authenticationService.openForgotPassPopup();
  }

  signup() {
    this.dialogRef.close();
    this.popupData.authenticationService.openSignupPopup();
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      // remember: true,
    });
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
