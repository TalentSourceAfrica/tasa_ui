import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SharedService } from '@app/services/shared.service';
import { delay } from 'rxjs/operators';
import { untilDestroyed } from '@app/@core';

//extra
import * as AOS from 'aos';
declare var jQuery: any;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  contactUsForm!: FormGroup;
  isPartnerWithUs: boolean = false;
  constructor(private formBuilder: FormBuilder, private sharedService: SharedService) {}

  initForm() {
    this.contactUsForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contactNumber: [
        '',
        [Validators.required, Validators.pattern(this.sharedService.utilityService.CustomValidators.onlyNumber)],
      ],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
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
    jQuery('.mainmenu-area').css({ background: '#867899' });

    window.scrollTo(0, 0);
    this.initForm();
    AOS.init();

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
