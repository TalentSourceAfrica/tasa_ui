import { Component, OnInit, Directive } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService, AuthenticationService } from '@app/auth';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  uds: any;
  courseConfig: any = {
    courseKey: '',
    course: undefined,
    fetchingCourse: true,
  };

  constructor(
    private sharedService: SharedService,
    public route: ActivatedRoute,
    public credentialsService: CredentialsService,
    public authenticationService: AuthenticationService,
    public router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.courseConfig.courseKey = this.route.snapshot.params.key;
    this.uds = this.sharedService.plugins.undSco;
  }

  getCourseDetail() {
    let $t = this;
    $t.courseConfig.fetchingCourse = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getCourseDetails', {
      '{courseKey}': $t.courseConfig.courseKey,
    });
    if ($t.user) {
      apiUrl = $t.sharedService.urlService.addQueryStringParm(apiUrl, 'user', $t.user.email);
    }
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.courseConfig.course = response.responseObj;
        if ($t.user) {
          $t.user['recentlyViewed'].push({
            image_url: response.responseObj.image_url,
            key: response.responseObj.key,
            subject: response.responseObj.subjects[0].name,
            title: response.responseObj.title,
            program: response.responseObj.programs.length ? response.responseObj.programs[0].title : '',
          });
          $t.user['recentlyViewed'] = $t.uds.uniq($t.user['recentlyViewed'], (d: any) => {
            return d.key;
          });
          $t.authenticationService.login(this.user);
        }
        $t.courseConfig.fetchingCourse = false;
      },
      (error) => {
        $t.courseConfig.fetchingCourse = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error);
        setTimeout(() => {
          $t.router.navigate(['/all-course'], { replaceUrl: true });
        }, 1000);
      }
    );
  }

  addToCart() {
    let $t = this;
    if ($t.user == null) {
      $t.authenticationService.openLoginPopup();
    } else {
      // call the cart
    }
  }

  getCourseVideo(_url: any) {
    // return 'https://www.youtube.com/embed/tgbNymZ7vqY';
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/watch?v=OiRfkH5_MSM');
  }

  ngOnInit(): void {
    this.getCourseDetail();
    window.scrollTo(0, 0);
    this.sharedService.utilityService.requiredStyleForHomeHeader();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
