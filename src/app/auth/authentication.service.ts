import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// service
import { Credentials, CredentialsService } from './credentials.service';
import { SharedService } from '@app/services/shared.service';

import { SignupPopupComponent } from '@app/partials/popups/authentication/signup-popup/signup-popup.component';
import { LoginPopupComponent } from '@app/partials/popups/authentication/login-popup/login-popup.component';
import { ForgotPasswordPopupComponent } from '@app/partials/popups/authentication/forgot-password-popup/forgot-password-popup.component';

// export interface LoginContext {
//   username: string;
//   password: string;
//   remember?: boolean;
// }

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private credentialsService: CredentialsService, private sharedService: SharedService) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: any): Observable<Credentials> {
    // Replace by proper authentication call
    const data = {
      username: context.username,
      token: '123456',
    };
    this.credentialsService.setCredentials(context, context.remember || false);
    return of(data);
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }

  openLoginPopup() {
    this.sharedService.dialogService.open(LoginPopupComponent, {
      width: '600px',
      data: { authenticationService: this },
      disableClose: false,
    });
  }

  openSignupPopup() {
    this.sharedService.dialogService.open(SignupPopupComponent, {
      width: '600px',
      data: { authenticationService: this },
      disableClose: false,
    });
  }

  openForgotPassPopup() {
    this.sharedService.dialogService.open(ForgotPasswordPopupComponent, {
      width: '600px',
      data: { authenticationService: this },
      disableClose: false,
    });
  }
}
