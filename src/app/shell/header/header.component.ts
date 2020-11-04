import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// services
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @ViewChild('file', { static: false }) public file: any;
  isAdmin: boolean = false;
  searchCourseText: string = '';
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService,
    private sharedService: SharedService
  ) {
    this.user.type.toLowerCase() == 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
  }

  onCourseSearch() {
    this.sharedService.utilityService.onCourseSearch(this.searchCourseText, 'text');
  }

  ngOnInit() {
    if (this.sharedService.deviceDetectorService.isMobile()) {
      $('.page-wrapper').removeClass('toggled');
    }
  }

  ngAfterViewInit(): void {
    $('.sidebar-dropdown > a').click(function () {
      $('.sidebar-submenu').slideUp(200);
      if ($(this).parent().hasClass('active')) {
        $('.sidebar-dropdown').removeClass('active');
        $(this).parent().removeClass('active');
      } else {
        $('.sidebar-dropdown').removeClass('active');
        $(this).next('.sidebar-submenu').slideDown(200);
        $(this).parent().addClass('active');
      }
    });

    $('#close-sidebar').click(function () {
      $('.page-wrapper').removeClass('toggled');
    });
    $('#show-sidebar').click(function () {
      $('.page-wrapper').addClass('toggled');
    });
  }

  logout() {
    this.sharedService.uiService.showApiSuccessPopMsg('Logout Successfully...!');
    setTimeout(() => {
      this.sharedService.uiService.closePopMsg();
      this.authenticationService.logout().subscribe(() => this.router.navigate(['/home'], { replaceUrl: true }));
    }, 1000);
  }

  login() {
    this.authenticationService.openLoginPopup();
  }

  userDetails() {
    this.authenticationService.openUserDetailsPopup();
  }

  scrollToFaq(_id: string) {
    this.sharedService.utilityService.scrollToElement(_id);
  }

  callUpload() {
    this.file.nativeElement.click();
  }

  handleFileInput(event: any) {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadUserImage', { '{email}': $t.user.email });
    let files = event.target.files;
    var form = new FormData();
    form.append('file', files[0], files[0].name);
    if ($t.sharedService.utilityService.ValidateImageUpload(files[0].name)) {
      $t.sharedService.uiService.showApiStartPopMsg('Updating User Avatar...');

      $t.sharedService.configService.post(apiUrl, form).subscribe(
        (response: any) => {
          $t.sharedService.uiService.showApiSuccessPopMsg('User Avatar Updated...');
          $t.user.image = response.url;
          $t.authenticationService.login($t.user);
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
        }
      );
    } else {
      $t.sharedService.uiService.showApiErrorPopMsg(
        'Uploaded File is not a Valid Image. Only JPG, PNG and JPEG files are allowed.'
      );
    }
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
