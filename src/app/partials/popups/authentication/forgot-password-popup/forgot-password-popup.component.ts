import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

//service
import { SharedService } from '@app/services/shared.service';

//component
import { LoginComponent } from '@app/auth/login.component';

@Component({
  selector: 'app-forgot-password-popup',
  templateUrl: './forgot-password-popup.component.html',
  styleUrls: ['./forgot-password-popup.component.scss'],
})
export class ForgotPasswordPopupComponent implements OnInit {
  forgortPassForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ForgotPasswordPopupComponent>,
    private sharedService: SharedService
  ) {
    this.initForm();
  }

  login() {
    this.dialogRef.close();
    this.sharedService.dialogService.open(LoginComponent, { width: '600px', data: {}, disableClose: false });
  }

  initForm() {
    this.forgortPassForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {}
}
