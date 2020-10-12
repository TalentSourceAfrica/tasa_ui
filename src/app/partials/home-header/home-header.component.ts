import { Component, OnInit } from '@angular/core';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { Router } from '@angular/router';

//extra
declare var jQuery: any;

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
})
export class HomeHeaderComponent implements OnInit {
  menuHidden = true;
  searchCourseText: string = '';
  constructor(
    private router: Router,
    private sharedService: SharedService,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService
  ) {}

  signup() {
    this.authenticationService.openSignupPopup();
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  logout() {
    this.sharedService.uiService.showApiSuccessPopMsg('Logout Successfully...!');
    this.authenticationService.logout().subscribe(() => this.router.navigate(['/home'], { replaceUrl: true }));
  }

  login() {
    this.authenticationService.openLoginPopup();
  }

  partnerWithUs() {
    this.sharedService.utilityService.changeMessage('PARTNER-WITH-US');
    this.router.navigate(['/contact-us'], { replaceUrl: true });
  }

  userDetails() {
    this.authenticationService.openUserDetailsPopup();
  }

  scrollToFaq(_id: string) {
    this.sharedService.utilityService.scrollToElement(_id);
  }

  onCourseSearch() {
    this.sharedService.utilityService.onCourseSearch(this.searchCourseText, 'text');
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    jQuery('#mainmenu-area').sticky({
      topSpacing: 0,
    });
  }
}
