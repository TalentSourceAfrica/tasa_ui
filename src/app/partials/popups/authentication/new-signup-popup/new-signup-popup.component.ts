import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MustMatch } from '@app/auth/must-match';
import { Logger, untilDestroyed } from '@core';
import { finalize } from 'rxjs/operators';

import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-new-signup-popup',
  templateUrl: './new-signup-popup.component.html',
  styleUrls: ['./new-signup-popup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewSignupPopupComponent implements OnInit {
	popupData: any;
	// signinForm: FormGroup;
	// accountForm: FormGroup;
	userDetailsForm: FormGroup;
	loginForm: FormGroup;
	newUserObj: any;
	isLoading = false;
	show: boolean = false;
	signupType: any = [
	    { value: 0, dbValue: 'Mentee', viewValue: 'Student / Professional' },
	    { value: 1, dbValue: 'Mentor', viewValue: 'Mentor' },
	    { value: 2, dbValue: 'Recruiter', viewValue: 'Recruiter' },
	];
 	userType = { value: 0, dbValue: 'Mentee', viewValue: 'Student / Professional' };
 	isEmailAvailable = true;
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private sharedService: SharedService,
		private dialogRef: MatDialogRef<NewSignupPopupComponent>,
		public formBuilder: FormBuilder,
		private router: Router
	) { 
		this.popupData = data;
		this.userType = this.signupType[this.popupData.case == 'student' ? 0 : 2];
   		this.initForm();
   		this.createForm();
	}

	init() {
		var overlay = document.getElementById("new-overlay");
		// Buttons to 'switch' the page
		var openSignUpButton = document.getElementById("slide-left-button");
		var openSignInButton = document.getElementById("slide-right-button");

		// The sidebars
		var leftText = document.getElementById("sign-in");
		var rightText = document.getElementById("sign-up");

		// The forms
		var accountForm = <HTMLFormElement>document.getElementById('sign-in-info');
		var signinForm = <HTMLFormElement>document.getElementById('sign-up-info');

		// Open the Sign Up page
		 let openSignUp = () =>{
		  // Remove classes so that animations can restart on the next 'switch'
		  leftText.classList.remove("overlay-text-left-animation-out");
		  overlay.classList.remove("open-sign-in");
		  rightText.classList.remove("overlay-text-right-animation");
		  // Add classes for animations
		  accountForm.className += " form-left-slide-out"
		  rightText.className += " overlay-text-right-animation-out";
		  overlay.className += " open-sign-up";
		  leftText.className += " overlay-text-left-animation";
		  // hide the sign up form once it is out of view
		  setTimeout(function(){
		    accountForm.classList.remove("form-left-slide-in");
		    accountForm.style.display = "none";
		    accountForm.classList.remove("form-left-slide-out");
		  }, 700);
		  // display the sign in form once the overlay begins moving right
		  setTimeout(function(){
		    signinForm.style.display = "flex";
		    signinForm.class += " form-right-slide-in";
		  }, 200);
		}

		// Open the Sign In page
		let openSignIn = () =>{
		  // Remove classes so that animations can restart on the next 'switch'
		  leftText.classList.remove("overlay-text-left-animation");
		  overlay.classList.remove("open-sign-up");
		  rightText.classList.remove("overlay-text-right-animation-out");
		  // Add classes for animations
		  signinForm.class += " form-right-slide-out";
		  leftText.className += " overlay-text-left-animation-out";
		  overlay.className += " open-sign-in";
		  rightText.className += " overlay-text-right-animation";
		  // hide the sign in form once it is out of view
		  setTimeout(function(){
		    signinForm.classList.remove("form-right-slide-in")
		    signinForm.style.display = "none";
		    signinForm.classList.remove("form-right-slide-out")
		  },700);
		  // display the sign up form once the overlay begins moving left
		  setTimeout(function(){
		    accountForm.style.display = "flex";
		    accountForm.class += " form-left-slide-in";
		  },200);
		}

		// When a 'switch' button is pressed, switch page
		openSignUpButton.addEventListener("click", openSignUp, false);
		openSignInButton.addEventListener("click", openSignIn, false);
	}

	initForm() {
	    if (this.popupData.case == 'student') {
	      this.userDetailsForm = this.formBuilder.group(
	        {
	          firstName: ['', [Validators.required]],
	          lastName: ['', [Validators.required]],
	          email: [
	            this.popupData.email != undefined ? this.popupData.email : '',
	            [Validators.required, Validators.email],
	          ],
	          password: ['', [Validators.required]],
	          confirmPassword: ['', [Validators.required]],
	          termsCond: [true, [Validators.required]],
	          country: ['', [Validators.required]],
	          state: ['', [Validators.required]],
	          city: ['', [Validators.required]],
	          postalCode: ['', [Validators.required]],
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
	    } else {
	      this.userDetailsForm = this.formBuilder.group(
	        {
	          firstName: ['', [Validators.required]],
	          lastName: ['', [Validators.required]],
	          email: ['', [Validators.required, Validators.email]],
	          password: ['', [Validators.required]],
	          confirmPassword: ['', [Validators.required]],
	          termsCond: [true, [Validators.required]],
	          orgId: [''],
	          organizationName: ['', [Validators.required]],
	          location: [''],
	          contactNo: [''],
	          contactEmail: [''],
	          linkedin: [''],
	          twitter: [''],
	        },
	        {
	          validator: MustMatch('password', 'confirmPassword'),
	        }
	      );
	    }
    }

 	flipOnClick(_case: string) {
	    let flip = () => {
	        jQuery('.flip-card').find('.flip-card-inner').toggleClass('is-flipped');
	        setTimeout(() => {
	          jQuery('.flip-card').find('.flip-card-inner').find('#flip-card-front').toggleClass('d-none');
	          this.show = !this.show;
	        }, 200);
	    };
	    switch(this.popupData.case) {
	      case 'student':
	        if (_case == 'flip') {
	          flip();
	        } else {
	          if (this.getForm().firstName.status == 'VALID' && this.getForm().lastName.status == 'VALID' ) {
	            this.onSubmit();
	          } else {
	            this.userDetailsForm.controls['firstName'].setErrors({'required': true});
	            this.userDetailsForm.controls['lastName'].setErrors({'required': true});
	            flip();
	          }
	        }
	        break;
	      case 'recruiter':
	        if (_case == 'flip') {
	          flip();
	        } else {
	          if (this.getForm().organizationName.status == 'VALID' && this.getForm().firstName.status == 'VALID' && this.getForm().lastName.status == 'VALID') {
	            this.onSubmit();
	          } else {
	            flip();
	          }
	        }
	        break; 
    	}
    
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
      orgId: _payload.orgId,
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
      areaOfPreference: [],
      preferredRole: [],
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
      clients: [],
      collaborator: '',
      dateOfEstablishment: '',
      contactNo: '',
      contactEmail: '',
      subscription: '',
      website: '',
      linkedIn: '',
      twitter: '',
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
	    let areaOfPreference: any = [],
	      preferredRole: any = [];
	    payload['username'] = payload.email;
	    if ($t.popupData.case == 'student') {
	      payload['experience'] = [];
	      payload['education'] = [];
	      $t.setNewUserObj(payload);
	    }
	    $t.sharedService.configService.post(apiUrl, $t.popupData.case == 'student' ? $t.newUserObj : payload).subscribe(
	      (response: any) => {
	        $t.userDetailsForm.reset();
	        $t.dialogRef.close();
	        if ($t.userType.dbValue !== 'Recruiter') {
	          $t.sharedService.uiService.showApiSuccessPopMsg('Please check inbox for successful verification...!');
	        } else {
	          $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
	        }
	      },
	      (error) => {
	         $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
	      }
	    );
  	}

  	getForm() {
    	return this.userDetailsForm.controls;
  	}

  	checkEmail() {
	    let $t = this;
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

  	login() {
	    this.isLoading = true;
	    this.sharedService.uiService.showApiStartPopMsg('Logging you in...');
	    let apiUrl = this.sharedService.urlService.simpleApiCall('login');
	    this.sharedService.configService
	      .post(apiUrl, this.loginForm.value)
	      .pipe(
	        finalize(() => {
	          this.loginForm.markAsPristine();
	          this.isLoading = false;
	        }),
	        untilDestroyed(this)
	      )
	      .subscribe(
	        (response: any) => {
	          this.popupData.authenticationService.login(response.responseObj);
	          this.popupData.authenticationService.setToken(JSON.parse(response.data).access_token);
	          this.sharedService.uiService.closePopMsg();
	          this.dialogRef.close();
	          this.router.navigate(['/social-network/posts'], { replaceUrl: true });
	          setTimeout(() => {
	            jQuery('.header-top-area').removeClass('position-absolute');
	          }, 500);
	        },
	        (error) => {
	          this.sharedService.uiService.showApiErrorPopMsg(error.error.message);
	        }
	      );
  	}

    forgotPass() {
	   this.dialogRef.close();
	   this.popupData.authenticationService.openForgotPassPopup();
	}

	signup() {
	   this.dialogRef.close();
	   this.popupData.authenticationService.openSignupPopup('student', '');
	}

	private createForm() {
	    this.loginForm = this.formBuilder.group({
	      username: ['', [Validators.required, Validators.email]],
	      password: ['', Validators.required],
	      // remember: true,
	    });
	}

	openDoc(){
		
	}

	ngOnInit(): void {
		this.init();
	}

	ngOnDestroy(): void {}
}