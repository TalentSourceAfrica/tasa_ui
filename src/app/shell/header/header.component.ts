import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// services
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

// // component
// import { LoginComponent } from '@app/auth/login.component';

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
    this.authenticationService.openLoginPopup();
  }

  signup() {
    this.authenticationService.openSignupPopup();
  }

  get username(): string | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials.username : null;
  }
}
