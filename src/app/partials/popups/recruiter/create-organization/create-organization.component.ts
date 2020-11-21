import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss'],
})
export class CreateOrganizationComponent implements OnInit {
  @ViewChild('orgfile', { static: false }) public orgfile: any;
  signupForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateOrganizationComponent>,
    public sharedService: SharedService
  ) {}

  uploadImage() {
    this.orgfile.nativeElement.click();
  }

  handleFileInput(event: any) {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadSingle', { '{email}': 'org@gmail.com' });
    let files = event.target.files;
    var form = new FormData();
    form.append('file', files[0], files[0].name);
    if ($t.sharedService.utilityService.ValidateImageUpload(files[0].name)) {
      $t.sharedService.uiService.showApiStartPopMsg('Adding Image ...');

      $t.sharedService.configService.post(apiUrl, form).subscribe(
        (response: any) => {
          $t.signupForm.get('orgImage').patchValue(response.url);
          $t.sharedService.uiService.showApiSuccessPopMsg('Image Added...');
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
        }
      );
    } else {
      $t.sharedService.uiService.showApiErrorPopMsg(
        'Uploaded File is not a Valid Image. Only JPG, PNG and JPEG files are allowed.'
      );
    }
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      orgName: ['', [Validators.required]],
      orgDesc: ['', [Validators.required]],
      orgImage: [{ value: '', disabled: true }, [Validators.required]],
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
    let payload = { ...$t.signupForm.getRawValue() };
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response: any) => {
        $t.dialogRef.close();
        $t.sharedService.utilityService.changeMessage('TRIGGER-ORGANIZATION-UPDATE');
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
