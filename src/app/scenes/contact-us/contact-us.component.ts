import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SharedService } from '@app/services/shared.service';

import * as AOS from 'aos';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit {
  contactUsForm!: FormGroup;
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
        $t.sharedService.uiService.showApiSuccessPopMsg('Thank you for contacting Talent Source Africa');
        $t.contactUsForm.reset();
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
      }
    );
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.initForm();
    AOS.init();
  }
}
