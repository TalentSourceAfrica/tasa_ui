import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { CredentialsService } from '@app/auth';

@Component({
  selector: 'app-partners',
  templateUrl: './partners.component.html',
  styleUrls: ['./partners.component.scss'],
})
export class PartnersComponent implements OnInit {
  @ViewChild('partnerFile', { static: false }) public partnerFile: any;
  selectedPartner: any;
  partnerData: any = [];
  isLoading: boolean = true;
  constructor(public sharedService: SharedService, public credentialsService: CredentialsService) {}

  addNews() {
    this.partnerData.push({
      partnerId: '',
      partnerName: '',
      partnerDesc: '',
      partnerSince: '',
      partnerContact: '',
      partnerAddress: '',
      partnerLink: '',
      partnerURL: '',
      partnerImage: '',
      partnerStudentMaxCnt: '',
      partnerStudentEntolledCnt: '',
      createdBy: '',
      updatedBy: '',
      createdOn: '',
      updatedOn: '',
    });
  }

  uploadImage(partner: any) {
    this.selectedPartner = partner;
    this.partnerFile.nativeElement.click();
  }

  handleFileInput(event: any) {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadSingle', {
      '{email}': $t.user.email,
    });
    let files = event.target.files;
    var form = new FormData();
    form.append('file', files[0], files[0].name);
    if ($t.sharedService.utilityService.ValidateImageUpload(files[0].name)) {
      $t.sharedService.uiService.showApiStartPopMsg('Adding Image ...');

      $t.sharedService.configService.post(apiUrl, form).subscribe(
        (response: any) => {
          $t.selectedPartner.partnerImage = response.data;
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

  savePartner(partner: any, partnerIndex: number) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Adding Partner...!');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('addPartner');
    $t.sharedService.configService.post(apiUrl, partner).subscribe(
      (response: any) => {
        $t.partnerData[partnerIndex] = response;
        $t.sharedService.uiService.showApiSuccessPopMsg('Partner Added...!');
        $t.refresh();
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  updatePartner(partner: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Updating Partner...!');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('updatePartner');
    $t.sharedService.configService.put(apiUrl, partner).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Partner Updated...!');
        $t.refresh();
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  deletePartner(partner: any, partnerIndex: any) {
    let $t = this;
    if (partner.partnerId != '') {
      $t.sharedService.uiService.showApiStartPopMsg('Deleting Partner...!');
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('deletePartner', {
        '{partnerId}': partner.partnerId,
      });
      $t.sharedService.configService.delete(apiUrl).subscribe(
        (response: any) => {
          $t.partnerData.splice(partnerIndex, 1);
          $t.sharedService.uiService.showApiSuccessPopMsg('Partner Deleted...!');
          $t.refresh();
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    } else {
      $t.partnerData.splice(partnerIndex, 1);
    }
  }

  getPartners() {
    let $t = this;
    $t.isLoading = true;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getPartner');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.partnerData = response.responseObj;
        $t.partnerData.forEach((data: any) => {
          if (data.partnerSince != null) {
            data.partnerSince = $t.sharedService.plugins.mom(data.partnerSince).format('MM-DD-YY hh:mm:ss');
          }
        });
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  refresh() {
    this.getPartners();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    this.getPartners();
  }
}
