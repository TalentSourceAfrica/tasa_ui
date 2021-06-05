import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/auth';
import { documents } from '@app/models/constants';
import { OurTeamComponent } from '@app/partials/popups/about-us/our-team/our-team.component';
import { SharedService } from '@app/services/shared.service';

// extra
declare var jQuery: any;
import * as AOS from 'aos';


@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  contactUsForm!: FormGroup;
  documents = documents
  constructor(
    private formBuilder: FormBuilder,
    public sharedService: SharedService,
    private authenticationService: AuthenticationService
  ) {}

  openMyTeam(_name: string, _type: number) {
    this.sharedService.dialogService.open(OurTeamComponent, {
      width: '800px',
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

  ngAfterViewInit(): void {
    AOS.init({
      once: true
    });
  }
}
