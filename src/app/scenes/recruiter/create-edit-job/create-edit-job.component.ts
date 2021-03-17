import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-create-edit-job',
  templateUrl: './create-edit-job.component.html',
  styleUrls: ['./create-edit-job.component.scss'],
})
export class CreateEditJobComponent implements OnInit {
  public countries: any = [];
  public industryData: any = [];
  public steps: any = [
    {
      id: 0,
      isActive: true,
    },
    {
      id: 1,
      isActive: false,
    },
    {
      id: 2,
      isActive: false,
    },
  ];
  jobConfig: any = {
    job: {
      description: '',
      title: '',
      status: 'Inactive',
      publishOn: '',
      unlistFlag: '',
      expireOn: '',
      tags: [],
      applicants: [],
      location: '',
      orgId: this.user.orgId,
      minimumReq: '',
      countOfOpenings: 0,
      experienceFrom: 0,
      experienceTo: 0,
      rejectReason: '',
      tasaId: '',
      industry: [],
      city: '',
      state: '',
      country: '',
      jobType: '',
      seniorityLevel: [],
      reqEducationExperience: '',
      desiredSkill: [],
      benefits: '',
      openingType: '',
      schedule: [],
      covidPrecautions: '',
      createdOn: '',
      updatedOn: '',
      recruiterEmailId: this.user.email,
      createdBy: this.user.firstName + ' ' + this.user.lastName,
      updatedBy: 'string',
    },
  };
  constructor(public sharedService: SharedService, private credentialsService: CredentialsService) {}

  stepsClick(_id: number, _isForward: boolean) {
    // steps logic
    if (_isForward) {
      this.steps.find((d: any) => d.id === _id).isActive = false;
      this.steps.find((d: any) => d.id === _id + 1).isActive = true;
    } else {
      this.steps.find((d: any) => d.id === _id).isActive = false;
      this.steps.find((d: any) => d.id === _id - 1).isActive = true;
    }
  }

  getCountry() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getCountry');

    $t.sharedService.configService.get(apiUrl).subscribe((response) => {
      $t.countries = response;
    });
  }

  getIndustry() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getLovsByGroup', { '{group}': 'Industry' });
    $t.sharedService.configService.get(apiUrl).subscribe((response) => {
      $t.industryData = response[0].value;
    });
  }

  ngOnInit(): void {
    this.getCountry();
    this.getIndustry();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
