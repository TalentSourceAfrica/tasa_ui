import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SharedService } from '@app/services/shared.service';

import * as AOS from 'aos';
import { MustMatch } from '@app/auth/must-match';
import { CredentialsService } from '@app/auth';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  contactUsForm!: FormGroup;
  userDetails: any;
  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private credentialsService: CredentialsService
  ) {
    this.userDetails = this.user;
  }

  initForm() {
    this.contactUsForm = this.formBuilder.group(
      {
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  submit() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('updatePassword');
    $t.sharedService.uiService.showApiStartPopMsg('Updating Password...');
    $t.userDetails.password = $t.contactUsForm.value.password;
    $t.sharedService.configService.post(apiUrl, $t.userDetails).subscribe(
      (response) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Password Updated...');
        $t.contactUsForm.reset();
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
      }
    );
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.initForm();
    AOS.init();
  }
}
