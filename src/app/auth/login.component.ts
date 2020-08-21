import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger, untilDestroyed } from '@core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// service
import { SharedService } from '@app/services/shared.service';
import { AuthenticationService } from './authentication.service';

// component
import { ForgotPasswordPopupComponent } from '@app/partials/popups/authentication/forgot-password-popup/forgot-password-popup.component';
import { SignupPopupComponent } from '@app/partials/popups/authentication/signup-popup/signup-popup.component';

const log = new Logger('Login');

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private sharedService: SharedService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  ngOnDestroy() {}

  login() {
    this.isLoading = true;
    const login$ = this.authenticationService.login(this.loginForm.value);
    login$
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (credentials) => {
          log.debug(`${credentials.username} successfully logged in`);
          this.router.navigate([this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
        },
        (error) => {
          log.debug(`Login error: ${error}`);
          this.error = error;
        }
      );
  }

  forgotPass() {
    this.dialogRef.close();
    this.sharedService.dialogService.open(ForgotPasswordPopupComponent, {
      width: '600px',
      data: {},
      disableClose: false,
    });
  }

  signup() {
    this.dialogRef.close();
    this.sharedService.dialogService.open(SignupPopupComponent, {
      width: '600px',
      data: {},
      disableClose: false,
    });
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true,
    });
  }
}
