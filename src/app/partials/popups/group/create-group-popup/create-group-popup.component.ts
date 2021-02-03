import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-create-group-popup',
  templateUrl: './create-group-popup.component.html',
  styleUrls: ['./create-group-popup.component.scss'],
})
export class CreateGroupPopupComponent implements OnInit {
  @ViewChild('orgfile', { static: false }) public orgfile: any;
  groupForm: FormGroup;
  popupData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateGroupPopupComponent>,
    public sharedService: SharedService
  ) {
    this.popupData = data;
  }

  uploadImage() {
    this.orgfile.nativeElement.click();
  }

  initForm() {
    this.groupForm = this.formBuilder.group({
      groupId: '',
      groupTitle: ['', [Validators.required]],
      groupImageUrl: [{ value: '', disabled: true }, [Validators.required]],
      groupDescription: ['', [Validators.required]],
    });
  }

  onSubmit() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('createGroup', { '{adminId}': $t.popupData.user.email });
    $t.sharedService.uiService.showApiStartPopMsg('Creating Group...');
    let payload = { ...$t.groupForm.getRawValue() };
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response: any) => {
        $t.dialogRef.close();
        $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
      },
      (error: any) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
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
          $t.groupForm.get('groupImageUrl').patchValue(response.url);
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

  ngOnInit(): void {
    this.initForm();
  }
}
