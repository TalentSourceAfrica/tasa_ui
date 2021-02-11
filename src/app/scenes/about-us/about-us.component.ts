import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/auth';
import { OurTeamComponent } from '@app/partials/popups/about-us/our-team/our-team.component';
import { SharedService } from '@app/services/shared.service';

// extra
declare var jQuery: any;

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  contactUsForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public sharedService: SharedService,
    private authenticationService: AuthenticationService
  ) {}

  openMyTeam(_name: string, _type: number) {
    this.sharedService.dialogService.open(OurTeamComponent, {
      width: '50%',
      data: { name: _name, type: _type },
      disableClose: false,
    });
  }

  initForm() {
    this.contactUsForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: [''],
      contactNumber: [
        '',
        [Validators.required, Validators.pattern(this.sharedService.utilityService.CustomValidators.onlyNumber)],
      ],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  checkDisable() {
    return this.contactUsForm.invalid;
  }

  submit() {
    let $t = this;
    let apiUrl = this.sharedService.urlService.simpleApiCall('contactUs');
    $t.sharedService.uiService.showApiStartPopMsg('Sending...');
    $t.sharedService.configService.post(apiUrl, $t.contactUsForm.value).subscribe(
      (response) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Thank you for contacting Talent Source Africa', 6000);
        $t.contactUsForm.reset();
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
      }
    );
  }

  signup() {
    this.authenticationService.openSignupPopup('student', '');
  }

  ngOnInit(): void {
    this.initForm();
    setTimeout(() => {
      jQuery('.header-top-area').removeClass('position-absolute');
    }, 500);
    this.sharedService.utilityService.requiredStyleForHomeHeader();
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {}
}
