import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { forkJoin } from 'rxjs';

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
    activeGigs: [],
    inactiveGigs: [],
    isLoading: false,
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
      active: 'Y',
      createdOn: '',
      createdBy: '',
      updatedOn: '',
      updatedBy: '',
    },
  };
  constructor(
    private credentialsService: CredentialsService,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {}

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
      return dp;
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

  fetchUserGig() {
    let $t = this;
    $t.gigConfig.isLoading = true;
    let apiUrl1 = $t.sharedService.urlService.apiCallWithParams('getUserActiveGigs', { '{userId}': $t.user.email });
    let apiUrl2 = $t.sharedService.urlService.apiCallWithParams('getUserInactiveGigs', { '{userId}': $t.user.email });

    let api1 = $t.sharedService.configService.get(apiUrl1);
    let api2 = $t.sharedService.configService.get(apiUrl2);

    forkJoin([api1, api2]).subscribe(
      (response: any) => {
        $t.gigConfig.activeGigs = response[0].responseObj;
        $t.gigConfig.inactiveGigs = response[1].responseObj;
        if ($t.gigConfig.activeGigs.length || $t.gigConfig.inactiveGigs.length) {
          $t.gigConfig.isNew = false;
          $t.gigConfig.isLoading = false;
          $t.cdr.detectChanges();
        }
        console.log($t.gigConfig);
      },
      (error) => {
        $t.gigConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  activeInactiveGig(gig: any, type: string) {}

  editGig(gig: any) {
    gig.plans.forEach((d: any) => {
      d.deliveryDetails = d.deliveryDetails.map((dd: any) => {
        return { value: dd };
      });
    });
    this.gigConfig.gig = gig;
    this.gigConfig.startGig = true;
  }

  publish() {
    let $t = this;
    console.log($t.gigConfig.gig);

    $t.gigConfig.gig.plans.forEach((d: any) => {
      d.deliveryDetails = d.deliveryDetails.map((dd: any) => dd.value);
    });

    if ($t.gigConfig.gig.id === '') {
      let apiUrl = $t.sharedService.urlService.simpleApiCall('postSeller');
      $t.sharedService.uiService.showApiStartPopMsg('Publishing your card.');
      $t.sharedService.configService.post(apiUrl, $t.gigConfig.gig).subscribe(
        (response: any) => {
          $t.sharedService.uiService.showApiSuccessPopMsg('Your card is now visible to everyone on TaSA');
          $t.fetchUserGig();
          $t.gigConfig.startGig = false;
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    } else {
      let apiUrl = $t.sharedService.urlService.simpleApiCall('postSeller');
      $t.sharedService.uiService.showApiStartPopMsg('Editing your card.');
      $t.sharedService.configService.put(apiUrl, $t.gigConfig.gig).subscribe(
        (response: any) => {
          $t.sharedService.uiService.showApiSuccessPopMsg('Your card is now edited.');
          $t.fetchUserGig();
          $t.gigConfig.startGig = false;
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    }
  }

  ngOnInit(): void {
    this.fetchUserGig();
    this.getFreelanceCategory();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
