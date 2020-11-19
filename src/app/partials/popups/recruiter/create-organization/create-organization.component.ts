import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss'],
})
export class CreateOrganizationComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateOrganizationComponent>,
    public sharedService: SharedService
  ) {}

  initForm() {
    this.signupForm = this.formBuilder.group({
      orgName: ['', [Validators.required]],
      orgDesc: ['', [Validators.required]],
      registrationId: ['', [Validators.required]],
      contactPersonEmail: ['', [Validators.required, Validators.email]],
      contactPersonNo: ['', [Validators.required]],
      contactPersonName: ['', [Validators.required]],
      contactPersonDesignation: ['', [Validators.required]],
    });
  }

  onSubmit() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('addOrganization', { '{type}': 'Recruiter' });
    $t.sharedService.uiService.showApiStartPopMsg('Creating Organization...');
    let payload = { ...$t.signupForm.value };
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response:any) => {
        $t.dialogRef.close();
        $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
      },
      (error: any) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  ngOnInit(): void {
    this.initForm();
  }
}
