import { Component, OnInit, ViewChild } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-create-gig',
  templateUrl: './create-gig.component.html',
  styleUrls: ['./create-gig.component.scss'],
})
export class CreateGigComponent implements OnInit {
  @ViewChild('file', { static: false }) public file: any;
  @ViewChild('videoFile', { static: false }) public videoFile: any;
  links = ['First', 'Second', 'Third'];
  freelanceCategory: any = [];
  gigConfig: any = {
    isNew: true,
    startGig: false,
    gig: {
      id: '',
      userId: this.user.email,
      tasaId: this.user.tasaId,
      title: '',
      description: '',
      image: '',
      video: '',
      category: '',
      reasonToHire: '',
      plans: [
        {
          name: '',
          deliveryDays: '',
          price: 0,
          commission: 10,
          deliveryPrice: 0,
          revisions: 0,
          deliveryDetails: [],
        },
      ],
      active: '',
      createdOn: this.user.firstName + ' ' + this.user.lastName,
      createdBy: '',
      updatedOn: '',
      updatedBy: '',
    },
  };
  constructor(private credentialsService: CredentialsService, private sharedService: SharedService) {}

  addLink() {
    this.links.push(`Link ${this.links.length + 1}`);
  }

  startGigCreation() {
    this.gigConfig.startGig = true;
  }

  getDeliveryPrice(plan: any) {
    if (plan.price > 0) {
      const dp = plan.price * (plan.commission / 100) + plan.price;
      plan.deliveryPrice = dp;
    }
  }

  checkPlanDisable() {
    for (let index = 0; index < this.gigConfig.gig.plans; index++) {
      const plan = this.gigConfig.gig.plans[index];
      if (plan.name === '' || plan.deliveryDays === '' || plan.price === 0 || plan.revisions === 0) {
        return true;
      }
    }
  }

  addPricing() {
    if (this.gigConfig.gig.plans.length < 3) {
      this.gigConfig.gig.plans.unshift({
        name: '',
        deliveryDays: '',
        price: 0,
        commission: 10,
        deliveryPrice: 0,
        revisions: 0,
        deliveryDetails: [],
      });
    } else {
      this.sharedService.uiService.showApiErrorPopMsg('You can only add 3 pricing plans');
    }
  }

  addDeliveryDetails(plan: any) {
    plan.deliveryDetails.push({ value: '' });
  }

  removeDeliveryDetails(plan: any, di: number) {
    let reqPlan = this.gigConfig.gig.plans.find((d: any) => d.name === plan.name);
    if (reqPlan) {
      reqPlan.deliveryDetails.splice(di, 1);
    }
  }

  removePricing(index: number) {
    this.gigConfig.gig.plans.splice(index, 1);
  }

  getFreelanceCategory() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getLovsByGroup', { '{group}': 'FreelanceCategory' });
    $t.sharedService.configService.get(apiUrl).subscribe((response) => {
      $t.freelanceCategory = response[0].value;
    });
  }

  callUpload(event: any, type: string) {
    event.stopPropagation();
    event.preventDefault();
    if (type === 'video') {
      this.videoFile.nativeElement.click();
    } else {
      this.file.nativeElement.click();
    }
  }

  handleFileInput(event: any, type: string) {
    let $t = this;
    let callUpload = () => {
      $t.sharedService.uiService.showApiStartPopMsg('Adding...');
      $t.sharedService.configService.post(apiUrl, form).subscribe(
        (response: any) => {
          type === 'video' ? ($t.gigConfig.gig.video = response.url) : ($t.gigConfig.gig.image = response.url);
          $t.sharedService.uiService.closePopMsg();
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
        }
      );
    };

    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadSingle', { '{email}': $t.user.email });
    apiUrl = $t.sharedService.urlService.addQueryStringParm(apiUrl, 'profile', true);
    let files = event.target.files;
    var form = new FormData();
    form.append('file', files[0], files[0].name);
    let imageTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
    let videoTypes = ['video/mp4', 'video/mov', 'video/wmv', 'video/flv', 'video/avi', 'video/webm'];
    if (type == 'image') {
      if (imageTypes.indexOf(files[0].type) != -1) {
        callUpload();
      } else {
        $t.sharedService.uiService.showApiErrorPopMsg(
          'Incorrect file chosen, please choose an image (.jpeg, .jpg, .gif, .png)'
        );
        return;
      }
    } else {
      if (videoTypes.indexOf(files[0].type) != -1) {
        callUpload();
      } else {
        $t.sharedService.uiService.showApiErrorPopMsg(
          'Incorrect file chosen, please choose a video (.mp4, .mov, .wmv, .flv, .avi, .webm)'
        );
        return;
      }
    }
  }

  publish() {
    let $t = this;
    console.log($t.gigConfig.gig);
  }

  ngOnInit(): void {
    this.getFreelanceCategory();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
