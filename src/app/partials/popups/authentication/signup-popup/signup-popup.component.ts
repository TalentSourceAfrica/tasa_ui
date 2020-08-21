import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

//service
import { SharedService } from '@app/services/shared.service';

//component
import { LoginComponent } from '@app/auth/login.component';

@Component({
  selector: 'app-signup-popup',
  templateUrl: './signup-popup.component.html',
  styleUrls: ['./signup-popup.component.scss'],
})
export class SignupPopupComponent implements OnInit {
  signupForm: FormGroup;
  signupType: any = [
    { value: 0, viewValue: 'Mentee' },
    { value: 1, viewValue: 'Mentor' },
    { value: 2, viewValue: 'Recruiter' },
  ];
  userType = { value: 0, viewValue: 'Mentee' };
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SignupPopupComponent>,
    private sharedService: SharedService
  ) {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      termsCond: [true, [Validators.required]],
    });
  }

  login() {
    this.dialogRef.close();
    this.sharedService.dialogService.open(LoginComponent, { width: '600px', data: {}, disableClose: false });
  }

  onSubmit() {
    console.log(this.signupForm.value);
  }

  ngOnInit(): void {}
}
