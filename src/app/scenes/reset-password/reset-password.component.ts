import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SharedService } from '@app/services/shared.service';

import * as AOS from 'aos';
import { MustMatch } from '@app/auth/must-match';
import { CredentialsService } from '@app/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  contactUsForm: FormGroup;
  userDetails: any;
  isToken: boolean = false;
  isSubmit: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private credentialsService: CredentialsService,
    private route: ActivatedRoute
  ) {
    this.userDetails = this.user;
    if (this.route.snapshot.queryParams.token) {
      this.isToken = true;
    } else {
      this.isToken = false;
    }
  }

  checkCurrentPassword(event: any) {
    let $t = this;

    let apiUrl = $t.sharedService.urlService.apiCallWithParams('checkCurrentPassword', {
      '{email}': $t.user.email,
      '{currentPassword}': event.target.value,
    });

    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        if (response.data == 'Y') {
          $t.isSubmit = true;
        } else {
          $t.isSubmit = false;
        }
      },
      (error) => {}
    );
  }

  initForm() {
    if (this.isToken) {
      this.contactUsForm = this.formBuilder.group(
        {
          password: ['', [Validators.required]],
          confirmPassword: ['', [Validators.required]],
        },
        {
          validator: MustMatch('password', 'confirmPassword'),
        }
      );
    } else {
      this.contactUsForm = this.formBuilder.group(
        {
          currentPassword: ['', [Validators.required]],
          password: ['', [Validators.required]],
          confirmPassword: ['', [Validators.required]],
        },
        {
          validator: MustMatch('password', 'confirmPassword'),
        }
      );
    }
  }

  submit() {
    let $t = this;
    if (this.isToken) {
      let apiUrl = $t.sharedService.urlService.simpleApiCall('resetPassword');
      $t.sharedService.uiService.showApiStartPopMsg('Updating Password...');
      const payload = {
        password: $t.contactUsForm.value.password,
        token: $t.route.snapshot.queryParams.token,
      };
      $t.sharedService.configService.post(apiUrl, payload).subscribe(
        (response) => {
          $t.sharedService.uiService.showApiSuccessPopMsg('Password Updated...');
          $t.contactUsForm.reset();
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    } else {
      let apiUrl = $t.sharedService.urlService.simpleApiCall('updatePassword');
      $t.sharedService.uiService.showApiStartPopMsg('Updating Password...');
      $t.userDetails.password = $t.contactUsForm.value.password;
      $t.sharedService.configService.post(apiUrl, $t.userDetails).subscribe(
        (response) => {
          $t.sharedService.uiService.showApiSuccessPopMsg('Password Updated...');
          $t.contactUsForm.reset();
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    }
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    this.sharedService.utilityService.requiredStyleForHomeHeader();
    window.scrollTo(0, 0);
    this.initForm();
    AOS.init();
  }
}
