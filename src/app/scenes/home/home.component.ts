import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { OwlDOMData } from 'ngx-owl-carousel-o/lib/models/owlDOM-data.model';

// services
import { SharedService } from '@app/services/shared.service';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { Router } from '@angular/router';

// extra
declare var $: any;
import * as AOS from 'aos';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '@app/auth/must-match';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  isLoading = false;
  activeSlide: number = 0;
  news: Array<object> = [];
  posts: Array<object> = [];
  courses: Array<object> = [];
  panelOpenState = false;
  menuHidden = true;
  /**
   * signup variable
   */
  signupForm: FormGroup;
  doc = '';
  organisationList: any = [];
  termsAndCondition = 'https://www.fleetster.net/legal/standard-terms-and-conditions.pdf';
  popupData: any;
  signupType: any = [
    { value: 0, dbValue: 'Mentee', viewValue: 'Student / Professional' },
    { value: 1, dbValue: 'Mentor', viewValue: 'Mentor' },
    { value: 2, dbValue: 'Recruiter', viewValue: 'Recruiter' },
  ];
  userType = { value: 0, dbValue: 'Mentee', viewValue: 'Student / Professional' };
  isUsernameAvailable = true;
  isEmailAvailable = true;
  unamePattern = '^[a-zA-Z0-9_.-]*$';
  /**
   * signup variable
   */
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private authenticationService: AuthenticationService,
    private credentialsService: CredentialsService
  ) {}

  signup() {
    this.authenticationService.openSignupPopup();
  }

  getNews() {
    let apiUrl = this.sharedService.urlService.simpleApiCall('getNews');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.news = response;
        setTimeout(() => {
          this.newsSlider();
        }, 500);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPosts() {
    let apiUrl = this.sharedService.urlService.simpleApiCall('getPost');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.posts = response;
        setTimeout(() => this.testimonialSlider(), 500);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCourses() {
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getCourse', {
      '{page}': 1,
      '{size}': 10,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.courses = response.responseObj;
        setTimeout(() => {
          this.courseSlider();
        }, 500);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  toggleMenu() {
    this.menuHidden = !this.menuHidden;
  }

  userDetails() {
    this.authenticationService.openUserDetailsPopup();
  }

  newsSlider() {
    var $newsSlider = $('.news-slider');
    $newsSlider.owlCarousel({
      merge: true,
      smartSpeed: 1000,
      loop: true,
      nav: true,
      center: false,
      dots: false,
      autoplayHoverPause: true,
      navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
      autoplay: true,
      autoplayTimeout: 3000,
      margin: 80,
      responsiveClass: true,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 3,
        },
      },
    });
  }

  testimonialSlider() {
    var $testmonialCarousel = $('.testmonial-slider');
    $testmonialCarousel.owlCarousel({
      merge: true,
      smartSpeed: 1000,
      loop: true,
      nav: true,
      center: false,
      dots: false,
      autoplayHoverPause: true,
      navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
      autoplay: true,
      autoplayTimeout: 3000,
      margin: 80,
      responsiveClass: true,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 2,
        },
        1200: {
          items: 2,
        },
      },
    });
  }

  courseSlider() {
    /*---------------------------
          COURSE SLIDER
      -----------------------------*/
    var $courseCarousel = $('.course-list');
    $courseCarousel.owlCarousel({
      merge: true,
      smartSpeed: 1000,
      loop: true,
      nav: false,
      center: true,
      autoplayHoverPause: true,
      navText: ['<i class="fa fa-long-arrow-left"></i> Prev', 'Next <i class="fa fa-long-arrow-right"></i>'],
      autoplay: true,
      autoplayTimeout: 3000,
      margin: 10,
      responsiveClass: true,
      responsive: {
        0: {
          items: 1,
          margin: 0,
        },
        600: {
          items: 2,
        },
        1000: {
          items: 3,
        },
        1200: {
          items: 4,
        },
      },
    });
  }

  getPassedData(data: SlidesOutputData) {
    this.activeSlide = data.startPosition;
  }

  enroll(_course: any) {
    this.router.navigate(['/course/' + _course.key], { replaceUrl: true });
  }

  // signup code

  signupTypeChange() {
    this.userType.value == 0 || this.userType.value == 1 ? this.initForm(false) : this.initForm(true);
  }

  initForm(_isRecruiter: boolean) {
    if (!_isRecruiter) {
      this.signupForm = this.formBuilder.group(
        {
          firstName: ['', [Validators.required]],
          lastName: ['', [Validators.required]],
          username: ['', [Validators.required, Validators.pattern(this.unamePattern)]],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required]],
          confirmPassword: ['', [Validators.required]],
          termsCond: [true, [Validators.required]],
        },
        {
          validator: MustMatch('password', 'confirmPassword'),
        }
      );
    } else {
      this.signupForm = this.formBuilder.group(
        {
          firstName: ['', [Validators.required]],
          lastName: ['', [Validators.required]],
          organizationName: ['', [Validators.required]],
          username: ['', [Validators.required, Validators.pattern(this.unamePattern)]],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required]],
          confirmPassword: ['', [Validators.required]],
          termsCond: [true, [Validators.required]],
        },
        {
          validator: MustMatch('password', 'confirmPassword'),
        }
      );
    }
  }

  checkUsername() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('checkUsername', {
      '{userName}': $t.signupForm.value.username,
    });

    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        response.data == 'Y' ? ($t.isUsernameAvailable = true) : ($t.isUsernameAvailable = false);
      },
      (error) => {}
    );
  }

  checkEmail() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('checkEmail', {
      '{email}': $t.signupForm.value.email,
    });

    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        response.data == 'Y' ? ($t.isEmailAvailable = true) : ($t.isEmailAvailable = false);
      },
      (error) => {}
    );
  }

  createOrganization(){
    this.popupData.authenticationService.opneCreateOrganization();
  }

  onSubmit() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('signup');
    $t.sharedService.uiService.showApiStartPopMsg('Creating Account...');
    let payload = { ...$t.signupForm.value, type: $t.userType.dbValue };
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response: any) => {
        if ($t.userType.dbValue !== 'Recruiter') {
          $t.sharedService.uiService.showApiSuccessPopMsg('Please check inbox for successful verification...!');
        } else {
          $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
        }
      },
      (error: any) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  openTerms() {
    this.doc = this.termsAndCondition;
  }

  // signup code

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit() {
    this.initForm(false);
    this.isLoading = true;
    this.getCourses();
    this.getPosts();
    this.getNews();
  }

  ngAfterViewInit(): void {
    $('.mainmenu-area').css({ background: 'transparent' });
    $('.header-top-area').css({ position: 'absolute' });
    $(document).on(
      'ready',
      (function ($) {
        'use strict';

        /*---------------------------
          SMOOTH SCROLL
      -----------------------------*/
        $('ul#nav li a[href^="#"], a.navbar-brand, a.scrolltotop').on('click', function (event: any) {
          var id = $(this).attr('href');
          var offset = 60;
          var target = $(id).offset().top - offset;
          $('html, body').animate(
            {
              scrollTop: target,
            },
            1500,
            'easeInOutExpo'
          );
          event.preventDefault();
        });

        /*----------------------------
          MOBILE & DROPDOWN MENU
      ------------------------------*/
        $('.stellarnav').stellarNav({
          theme: 'dark',
          breakpoint: 900,
        });

        /*----------------------------
          SCROLL TO TOP
      ------------------------------*/
        $(window).scroll(function () {
          var $totalHeight = $(window).scrollTop();
          var $scrollToTop = $('.scrolltotop');
          if ($totalHeight > 300) {
            $('.scrolltotop').fadeIn();
          } else {
            $('.scrolltotop').fadeOut();
          }

          if ($totalHeight + $(window).height() === $(document).height()) {
            $scrollToTop.css('bottom', '90px');
          } else {
            $scrollToTop.css('bottom', '20px');
          }
        });

        /*--------------------------
         PARALLAX BACKGROUND
      ----------------------------*/
        // $(window).stellar({
        //   responsive: true,
        //   positionProperty: 'position',
        //   horizontalScrolling: false,
        // });

        /*---------------------------
        HOME SLIDER
    -----------------------------*/
        var $homeSlider = $('.welcome-slider-area');
        $homeSlider.owlCarousel({
          merge: true,
          smartSpeed: 3000,
          loop: true,
          nav: true,
          autoplayHoverPause: true,
          navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
          autoplay: true,
          autoplayTimeout: 3000,
          margin: 0,
          /*animateIn: 'fadeIn',
          animateOut: 'fadeOut',*/
          responsiveClass: true,
          responsive: {
            0: {
              items: 1,
            },
            600: {
              items: 1,
            },
            1000: {
              items: 1,
            },
            1200: {
              items: 1,
            },
          },
        });

        /*------------------------------
          VIDEO POPUP
      --------------------------------*/
        var $videoModal = $('.video-area-popup');
        $videoModal.modalVideo({
          channel: 'youtube',
        });

        /*---------------------------
          CLIENT SLIDER
      -----------------------------*/
        var $clientCarousel = $('.client-slider');
        $clientCarousel.owlCarousel({
          merge: true,
          smartSpeed: 1000,
          loop: true,
          nav: false,
          center: true,
          autoplayHoverPause: true,
          navText: ['<i class="fa fa-long-arrow-left"></i> Prev', 'Next <i class="fa fa-long-arrow-right"></i>'],
          autoplay: true,
          autoplayTimeout: 3000,
          margin: 30,
          responsiveClass: true,
          responsive: {
            0: {
              items: 1,
            },
            600: {
              items: 2,
            },
            1000: {
              items: 3,
            },
            1200: {
              items: 4,
            },
            1900: {
              items: 5,
            },
          },
        });

        /*--------------------------
          FACT COUNTERING
      ---------------------------*/
        // $('.counter').counterUp({
        //   delay: 10,
        //   time: 1000,
        // });

        /*--------------------------
          ACTIVE WOW JS
      ----------------------------*/
        // new WOW().init();

        /*---------------------------
          PLACEHOLDER ANIMATION
      ----------------------------*/
        // Placeholdem(document.querySelectorAll('[placeholder]'));
      })($)
    );

    $(window).on('load', function () {
      'use strict';
      /*--------------------------
          PRE LOADER
      ----------------------------*/
      $('.preeloader').fadeOut(1000);
    });

    AOS.init();
  }
}
