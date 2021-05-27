import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from '@app/@core';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import Swal from 'sweetalert2';
import { CartService } from '../cart/cart.service';

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
  isCourseAlreadyPurchased: boolean = false;
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
          $t.checkCoursePurchased();
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

  checkCoursePurchased() {
    const enrolledCourseIds = this.user.enrolledCourses.map((d: any) => d.course.key);
    if (enrolledCourseIds.includes(this.courseConfig.course.key)) {
      this.isCourseAlreadyPurchased = true;
    } else {
      this.isCourseAlreadyPurchased = false;
    }
  }

  addToCart(_type: string) {
    let $t = this;
    let apiUrl: any;
    if ($t.user == null) {
      $t.authenticationService.openSignupPopup('sign-in');
    } else {
      if (_type === 'buy') {
        apiUrl = $t.sharedService.urlService.apiCallWithParams('canByCourse', {
          '{tasaId}': $t.user.tasaId,
          '{courseId}': $t.courseConfig.course.key,
        });
      } else {
        apiUrl = $t.sharedService.urlService.apiCallWithParams('canEnrollCourse', {
          '{tasaId}': $t.user.tasaId,
          '{courseId}': $t.courseConfig.course.key,
        });
      }
      $t.sharedService.uiService.showApiStartPopMsg('Checking Eligibility...!');
      $t.sharedService.configService.get(apiUrl).subscribe(
        (response: any) => {
          if (_type === 'buy') {
            $t.buyCourse();
          } else {
            $t.enrollCourse();
          }
        },
        (error) => {
          if (_type === 'buy') {
            $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
          } else {
            let _callback = () => {
              $t.router.navigate(['/subscription-plans'], { replaceUrl: true });
            };
            $t.sharedService.uiService.showApiErrorPopMsgWithTwoActions(
              error.error.message,
              'Check Subscription Plans',
              _callback
            );
          }
        }
      );
    }
  }

  enrollCourse() {
    let $t = this;
    let _callBack = () => {
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('enrollCourse', {
        '{tasaId}': $t.user.tasaId,
        '{courseId}': $t.courseConfig.course.key,
      });
      let payload = {
        transactionId: $t.sharedService.utilityService.uuidv4Generator(),
        transactionStatus: '',
        transactionAmount: $t.courseConfig.course.offerPrice,
        transactionOn: '',
        type: '',
        subscriptionId: '',
        courseId: '',
      };
      $t.sharedService.configService.post(apiUrl, payload).subscribe(
        (response: any) => {
          $t.sharedService.uiService.showApiSuccessPopMsg('Enrolled To Course Successfully...!');
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    };
    $t.sharedService.uiService.showPreConfirmPopMsg('Do You Want To Enroll?', _callBack);
  }

  buyCourse() {
    let $t = this;
    $t.sharedService.uiService.closePopMsg();
    let _callback = () => {
      $t.cartService.setCartForCourse($t.courseConfig.course);
      Swal.fire({
        title: 'Added..!', // title of the modal
        text: '', // description of the modal
        type: 'success', // warning, error, success, info, and question,
        backdrop: true,
        confirmButtonClass: 'rounded-pill shadow-sm',
        cancelButtonClass: 'rounded-pill shadow-sm',
        confirmButtonText: 'Go To Checkout!',
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
    $t.sharedService.uiService.showPreConfirmPopMsg('Do You Want To Buy This Course', _callback);
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
