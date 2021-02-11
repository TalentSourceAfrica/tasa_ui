import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SharedService } from '@app/services/shared.service';
import { delay } from 'rxjs/operators';
import { untilDestroyed } from '@app/@core';

//extra
declare var jQuery: any;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContactUsComponent implements OnInit {
  contactUsForm!: FormGroup;
  isPartnerWithUs: boolean = false;
  constructor(private formBuilder: FormBuilder, private sharedService: SharedService) {}

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

  checkDisable(){
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

  ngOnInit(): void {
    setTimeout(() => {
      jQuery('.header-top-area').removeClass('position-absolute');
    }, 500);
    this.sharedService.utilityService.requiredStyleForHomeHeader();
    window.scrollTo(0, 0);
    this.initForm();

    this.sharedService.utilityService.currentMessage.pipe(delay(10), untilDestroyed(this)).subscribe((message) => {
      if (message == 'PARTNER-WITH-US') {
        this.isPartnerWithUs = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.sharedService.utilityService.changeMessage('default message');
  }
}
