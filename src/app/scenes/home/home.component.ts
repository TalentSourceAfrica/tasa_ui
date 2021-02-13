import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { OwlDOMData } from 'ngx-owl-carousel-o/lib/models/owlDOM-data.model';
import { documents } from '@app/models/constants';

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
  @ViewChild('stepper', { static: false }) stepper: any;
  isLoading = false;
  userDetailsForm: FormGroup;
  documents = documents;
  userDetails: any;
  countries: any;
  newUserObj: any;
  activeSlide: number = 0;
  news: Array<object> = [];
  posts: Array<object> = [];
  courses: Array<object> = [];
  panelOpenState = false;
  menuHidden = true;
  sliderSignUpMail: string = '';
  /**
   * signup variable
   */
  signupImages: any = [
    {
      id: 1,
      url: 'https://static.pexels.com/photos/317383/pexels-photo-317383.jpeg',
      text:
        'You are talented ambitious and driven but often feel undervalued, unwelcome, invisible or shuttered from the opportunities you desire ',
    },
    {
      id: 2,
      url: 'https://static.pexels.com/photos/257897/pexels-photo-257897.jpeg',
      text:
        'We created TaSA as an oasis of belonging and visibility for people of Black/African, Latinx, Indigenous, and Southeast Asian descent',
    },
    {
      id: 3,
      url: 'https://static.pexels.com/photos/33972/pexels-photo.jpg',
      text:
        'We created TaSA as an oasis of belonging and visibility for people of Black/African, Latinx, Indigenous, and Southeast Asian descent',
    },
  ];
  signupOwlOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    dots: false,
    autoHeight: true,
    autoWidth: true,
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
    },
  };
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
  ) {
    this.userDetails = this.user;
  }

  initForm() {
    this.userDetailsForm = this.formBuilder.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        termsCond: [true, [Validators.required]],
        country: ['', [Validators.required]],
        state: ['', [Validators.required]],
        city: ['', [Validators.required]],
        postalCode: ['', [Validators.required]],
        degreeFromDate: [null],
        degreeToDate: [null],
        highestDegree: ['', [Validators.required]],
        college: ['', [Validators.required]],
        university: ['', [Validators.required]],
        major: ['', [Validators.required]],
        minor: [''],
        description: [''],
        // certificate: [''],
        experience: [''],
        experienceFrom: [null],
        experienceTo: [null],
        organization: [''],
        currentRole: [''],
        // project: [''],
        areaOfPreference: ['', [Validators.required]],
        preferredRole: ['', [Validators.required]],
        careerGoals: ['', [Validators.required]],
        linkedin: [''],
        twitter: [''],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  setNewUserObj(_payload: any) {
    this.newUserObj = {
      tasaId: '',
      type: _payload.type,
      email: _payload.email,
      emailVerified: '',
      password: _payload.password,
      username: _payload.username,
      firstName: _payload.firstName,
      lastName: _payload.lastName,
      profileSummary: '',
      orgId: '',
      enrolledCourses: [],
      favoriteCourses: [],
      recentlyViewed: [],
      savedJobs: [],
      recentlyViewedJobs: [],
      recommendedCourses: [],
      wrongPasswordCount: 0,
      resetPassword: '',
      active: '',
      token: '',
      tokenCreationDate: null,
      gcpdocument: [],
      middleName: '',
      suffix: '',
      bio: '',
      dob: null,
      address1: '',
      address2: '',
      country: _payload.country,
      state: _payload.state,
      city: _payload.city,
      district: '',
      postalCode: _payload.postalCode,
      language: '',
      identifier: '',
      billingAddress1: '',
      billingAddress2: '',
      billingCity: '',
      billingState: '',
      billingPostalCode: '',
      image: '',
      education: _payload.education,
      experience: _payload.experience,
      certificate: [],
      areaOfPreference: _payload.areaOfPreference,
      preferredRole: _payload.preferredRole,
      careerGoals: '',
      teachingExperience: '',
      univTaught: '',
      collegeTaught: '',
      specialization: '',
      licenseNo: '',
      organizationName: '',
      location: '',
      description: '',
      about: '',
      vision: '',
      noOfEmployee: '',
      industry: '',
      media: '',
      noOfOpenings: '',
      natureOfOpening: '',
      clients: '',
      collaborator: '',
      dateOfEstablishment: '',
      contactNo: '',
      contactEmail: '',
      subscription: '',
      website: '',
      linkedIn: _payload.linkedin,
      twitter: _payload.twitter,
      team: '',
      signedOn: null,
      updatedOn: null,
      createdBy: '',
      updatedBy: '',
      xml: '',
      ein: '',
    };
  }

  onSubmit() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('signup');
    $t.sharedService.uiService.showApiStartPopMsg('Creating Account...');
    let payload = { ...JSON.parse(JSON.stringify($t.userDetailsForm.value)), type: $t.userType.dbValue };
    payload['username'] = Math.floor(Math.random() * 90000) + 10000;
    let areaOfPreference: any = [],
      preferredRole: any = [];
    payload['experience'] = [];
    payload.experience.push({
      experience: '',
      currentRole: [],
      description: [],
      organization: JSON.parse(JSON.stringify(payload.organization)),
      experienceTo: JSON.parse(JSON.stringify(payload.experienceTo)),
      experienceFrom: JSON.parse(JSON.stringify(payload.experienceFrom)),
    });
    payload['education'] = [];
    payload.education.push({
      highestDegree: JSON.parse(JSON.stringify(payload.highestDegree)),
      college: [],
      university: [],
      major: JSON.parse(JSON.stringify(payload.major)),
      minor: [],
      degreeFromDate: JSON.parse(JSON.stringify(payload.degreeFromDate)),
      degreeToDate: JSON.parse(JSON.stringify(payload.degreeToDate)),
    });
    payload.postalCode = parseInt(payload.postalCode);
    areaOfPreference.push(JSON.parse(JSON.stringify(payload.areaOfPreference)));
    preferredRole.push(JSON.parse(JSON.stringify(payload.preferredRole)));
    payload.areaOfPreference = JSON.parse(JSON.stringify(areaOfPreference));
    payload.preferredRole = JSON.parse(JSON.stringify(preferredRole));
    payload.experience[0].currentRole.push(JSON.parse(JSON.stringify(payload.currentRole)));
    payload.experience[0].description.push(JSON.parse(JSON.stringify(payload.description)));
    payload.education[0].college.push(JSON.parse(JSON.stringify(payload.college)));
    payload.education[0].university.push(JSON.parse(JSON.stringify(payload.university)));
    payload.education[0].minor.push(JSON.parse(JSON.stringify(payload.minor)));
    delete payload['currentRole'];
    delete payload['description'];
    delete payload['organization'];
    delete payload['experienceTo'];
    delete payload['experienceFrom'];
    delete payload['highestDegree'];
    delete payload['college'];
    delete payload['university'];
    delete payload['major'];
    delete payload['minor'];
    delete payload['degreeFromDate'];
    delete payload['degreeToDate'];
    delete payload['termsCond'];
    $t.setNewUserObj(payload);
    $t.sharedService.configService.post(apiUrl, $t.newUserObj).subscribe(
      (response: any) => {
        $t.userDetailsForm.reset();
        $t.sharedService.uiService.showApiSuccessPopMsg('Please check inbox for successful verification...!');
        $t.stepper.selectedIndex = 0;
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  getCountry() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getCountry');

    $t.sharedService.configService.get(apiUrl).subscribe((response) => {
      $t.countries = response;
    });
  }

  signup() {
    this.authenticationService.openSignupPopup('student', this.sliderSignUpMail);
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

  userDetailss() {
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
      autoplay: false,
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

  // signupTypeChange() {
  //   this.userType.value == 0 || this.userType.value == 1 ? this.initForm(false) : this.initForm(true);
  // }

  // initForm(_isRecruiter: boolean) {
  //   if (!_isRecruiter) {
  //     this.signupForm = this.formBuilder.group(
  //       {
  //         firstName: ['', [Validators.required]],
  //         lastName: ['', [Validators.required]],
  //         username: ['', [Validators.required, Validators.pattern(this.unamePattern)]],
  //         email: ['', [Validators.required, Validators.email]],
  //         password: ['', [Validators.required]],
  //         confirmPassword: ['', [Validators.required]],
  //         termsCond: [true, [Validators.required]],
  //       },
  //       {
  //         validator: MustMatch('password', 'confirmPassword'),
  //       }
  //     );
  //   } else {
  //     this.signupForm = this.formBuilder.group(
  //       {
  //         firstName: ['', [Validators.required]],
  //         lastName: ['', [Validators.required]],
  //         organizationName: ['', [Validators.required]],
  //         username: ['', [Validators.required, Validators.pattern(this.unamePattern)]],
  //         email: ['', [Validators.required, Validators.email]],
  //         password: ['', [Validators.required]],
  //         confirmPassword: ['', [Validators.required]],
  //         termsCond: [true, [Validators.required]],
  //       },
  //       {
  //         validator: MustMatch('password', 'confirmPassword'),
  //       }
  //     );
  //   }
  // }

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
    if (typeof $t.signupForm === 'undefined') {
      return;
    }
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('checkEmail', {
      '{email}': $t.userDetailsForm.value.email,
    });

    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        response.data == 'Y' ? ($t.isEmailAvailable = true) : ($t.isEmailAvailable = false);
      },
      (error) => {}
    );
  }

  createOrganization() {
    this.popupData.authenticationService.opneCreateOrganization();
  }

  openDoc(_type: string) {
    if (_type === 'privacy') {
      this.doc = documents.privacyPolicy;
    }
    if (_type === 'term') {
      this.doc = this.termsAndCondition;
    }
  }

  // signup code

  ngOnInit() {
    this.initForm();
    this.isLoading = true;
    this.getCourses();
    this.getPosts();
    this.getCountry();
    this.getNews();
  }

  ngAfterViewInit(): void {
    $('.mainmenu-area').css({ background: 'transparent' });
    $('.header-top-area').addClass('position-absolute');
    $(document).on(
      'ready',
      (function ($) {
        'use strict';

        /*---------------------------
          SMOOTH SCROLL
      -----------------------------*/
        // $('ul#nav li a[href^="#"], a.navbar-brand, a.scrolltotop').on('click', function (event: any) {
        //   var id = $(this).attr('href');
        //   var offset = 60;
        //   var target = $(id).offset().top - offset;
        //   $('html, body').animate(
        //     {
        //       scrollTop: target,
        //     },
        //     1500,
        //     'easeInOutExpo'
        //   );
        //   event.preventDefault();
        // });

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
