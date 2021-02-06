import { Component, OnInit, Directive } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CredentialsService, AuthenticationService } from '@app/auth';
import { DomSanitizer } from '@angular/platform-browser';
import { untilDestroyed } from '@app/@core';
import { CartService } from '../cart/cart.service';
import Swal from 'sweetalert2';

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
    private sanitizer: DomSanitizer,
    private cartService: CartService
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
      let _callback = () => {
        $t.cartService.setCartForCourse($t.courseConfig.course);
        Swal.fire({
          title: 'Added To Cart', // title of the modal
          text: '', // description of the modal
          type: 'success', // warning, error, success, info, and question,
          backdrop: true,
          confirmButtonClass: 'rounded-pill shadow-sm',
          cancelButtonClass: 'rounded-pill shadow-sm',
          confirmButtonText: 'Go To Cart!',
          showCancelButton: true,
        }).then((isConfirm) => {
          if (isConfirm.value) {
            Swal.close();
            this.router.navigate(['/cart']);
          } else {
            Swal.close();
          }
        });
      };
      this.sharedService.uiService.showPreConfirmPopMsg('Do You Want To Add This To Cart', _callback);
    }
  }

  getCourseVideo(_url: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/watch?v=OiRfkH5_MSM');
  }

  ngOnInit(): void {
    this.sharedService.utilityService.changeMessage('FETCH-COURSE-DETAILS');
    this.sharedService.utilityService.currentMessage.pipe(untilDestroyed(this)).subscribe((message) => {
      if (message === 'FETCH-COURSE-DETAILS') {
        this.getCourseDetail();
      }
    });

    window.scrollTo(0, 0);
    this.sharedService.utilityService.requiredStyleForHomeHeader();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
