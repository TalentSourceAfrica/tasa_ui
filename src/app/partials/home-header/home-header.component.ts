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
  courseConfig: any = {
    subjects: [],
  };
  menuHidden = true;
  searchCourseText: string = '';
  constructor(
    private router: Router,
    public sharedService: SharedService,
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
    let _callback = () => {
      this.sharedService.uiService.showApiSuccessPopMsg('Logout Successfully...!');
      setTimeout(() => {
        this.sharedService.uiService.closePopMsg();
        this.credentialsService.deleteAllCookies();
        this.authenticationService.logout().subscribe(() => this.router.navigate(['/home'], { replaceUrl: true }));
      }, 1000);
    };
    this.sharedService.uiService.showPreConfirmPopMsg('You Want To Logout', _callback);
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

  onCourseSearch(_type: string, _val?: string) {
    if (_type === 'text') {
      this.sharedService.utilityService.onCourseSearch(this.searchCourseText, _type);
    } else {
      this.sharedService.utilityService.onCourseSearch(_val, _type);
    }
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  fetchCourseFilter() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getFiltersData');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.courseConfig.subjects = response.responseObj.subjects;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.fetchCourseFilter();
  }

  ngAfterViewInit(): void {
    jQuery('#mainmenu-area').sticky({
      topSpacing: 0,
    });
  }
}
