import { Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { jobsSeniorityLevel, jobsType, jobsSchedule, jobsMinEducationLevels } from '@app/models/constants';
import { SharedService } from '@app/services/shared.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-create-edit-job',
  templateUrl: './create-edit-job.component.html',
  styleUrls: ['./create-edit-job.component.scss'],
})
export class CreateEditJobComponent implements OnInit {
  public countries: any = [];
  public industryData: any = [];
  public editor: Editor;
  public jobsSeniorityLevel = JSON.parse(JSON.stringify(jobsSeniorityLevel));
  public jobsType = JSON.parse(JSON.stringify(jobsType));
  public jobsSchedule = JSON.parse(JSON.stringify(jobsSchedule));
  public jobsMinEducationLevels = JSON.parse(JSON.stringify(jobsMinEducationLevels));

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
    {
      id: 3,
      isActive: false,
    },
    {
      id: 4,
      isActive: false,
    },
    {
      id: 5,
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
      openingType: 'Single Location',
      schedule: [],
      covidPrecautions: '',
      createdOn: '',
      updatedOn: '',
      recruiterEmailId: this.user.email,
      createdBy: this.user.firstName + ' ' + this.user.lastName,
      updatedBy: 'string',
    },
  };
  //chips
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(public sharedService: SharedService, private credentialsService: CredentialsService) {}

  add(event: MatChipInputEvent, _type?: string, _keyRef?: any): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      if (_type == 'skills') {
        this.jobConfig.job.desiredSkill.push(value.trim());
      }
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(skill: any, _type?: string, _keyRef?: any): void {
    let index: any;
    if (_type == 'skills') {
      index = this.jobConfig.job.desiredSkill.indexOf(skill);
      this.jobConfig.job.desiredSkill.splice(index, 1);
    }
  }

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

  saveJob(){
    console.log(this.jobConfig.job)
  }

  ngOnInit(): void {
    this.getCountry();
    this.getIndustry();
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
