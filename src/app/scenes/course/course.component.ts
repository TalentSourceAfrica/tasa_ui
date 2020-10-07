import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService, AuthenticationService } from '@app/auth';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
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
    private sanitizer: DomSanitizer
  ) {
    console.log(this.route.snapshot.params.id);
    this.courseConfig.courseKey = this.route.snapshot.params.key;
  }

  getCourseDetail() {
    let $t = this;
    $t.courseConfig.fetchingCourse = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getCourseDetails', {
      '{courseKey}': $t.courseConfig.courseKey,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.courseConfig.course = response.responseObj;
        $t.courseConfig.fetchingCourse = false;
      },
      (error) => {
        $t.courseConfig.fetchingCourse = false;
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
