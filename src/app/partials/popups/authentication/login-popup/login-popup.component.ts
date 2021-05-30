import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { Logger, untilDestroyed } from '@core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// service
import { SharedService } from '@app/services/shared.service';
import { finalize } from 'rxjs/operators';
import { encryptionKey } from '@app/models/constants';
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
    const encryptedPass = this.sharedService.encrDecrService.encrypt(encryptionKey.password, this.loginForm.value.password);
    localStorage.setItem('encryptedPass', encryptedPass);
    this.sharedService.uiService.showApiStartPopMsg('Logging you in...');
    let apiUrl = this.sharedService.urlService.apiCallWithParams('login', {
      '{email}': this.loginForm.value.username,
    });
    this.sharedService.utilityService.changeMessage('BEFORE-LOGIN');
    this.sharedService.configService
      .post(apiUrl)
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
          if (
            (response.responseObj.image === '' ||
              response.responseObj.experience.length === 0 ||
              response.responseObj.education.length === 0) &&
            response.responseObj.type === 'Mentee'
          ) {
            this.popupData.authenticationService.openUserDetailsPopup();
          } else {
            this.router.navigate(['/social-network/posts'], { replaceUrl: true });
          }
          setTimeout(() => {
            jQuery('.header-top-area').removeClass('position-absolute');
            this.sharedService.utilityService.changeMessage('AFTER-LOGIN');
          }, 1000);
        },
        (error) => {
          this.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
  }

  forgotPass() {
    this.dialogRef.close();
    this.popupData.authenticationService.openForgotPassPopup();
  }

  signup() {
    this.dialogRef.close();
    this.popupData.authenticationService.openSignupPopup('student', '');
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
