import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// services
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

// component
import { LoginComponent } from '@app/auth/login.component';
import { SignupPopupComponent } from '@app/partials/popups/authentication/signup-popup/signup-popup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuHidden = true;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private sharedService: SharedService
  ) {}

  ngOnInit() {}

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  logout() {
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  login() {
    this.sharedService.dialogService.open(LoginComponent, { width: '600px', data: {}, disableClose: false });
  }

  signup() {
    this.sharedService.dialogService.open(SignupPopupComponent, { width: '600px', data: {}, disableClose: false });
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
  }
}
