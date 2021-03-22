import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { jobsSeniorityLevel, jobsType, jobsSchedule, jobsMinEducationLevels } from '@app/models/constants';
import { SharedService } from '@app/services/shared.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Editor } from 'ngx-editor';
import { ActivatedRoute, Router } from '@angular/router';

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
  public jobLocations = [''];
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
      id: '',
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
      locations: [''],
      city: '',
      state: '',
      country: '',
      jobType: '',
      seniorityLevel: [],
      reqEducationExperience: '',
      minimumEducationLevel: '',
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
    jobId: '',
    fetchingJob: false,
  };
  //chips
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    public sharedService: SharedService,
    private credentialsService: CredentialsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.jobConfig.jobId = this.activatedRoute.snapshot.queryParamMap.get('jobId');
  }

  addLocation() {
    this.jobLocations.push('');
  }

  removeLocation(index: number) {
    this.jobLocations.splice(index, 1);
  }

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

  stepsClick(_id: number, _isForward: boolean, _apiCall?: boolean) {
    // steps logic

    if (_isForward) {
      this.steps.find((d: any) => d.id === _id).isActive = false;
      this.steps.find((d: any) => d.id === _id + 1).isActive = true;
      _apiCall ? this.saveJob() : null;
    } else {
      if (this.jobConfig.job.openingType === 'Remote' && _id === 4) {
        _id -= 1;
      }
      this.steps.find((d: any) => d.id === _id).isActive = false;
      this.steps.find((d: any) => d.id === _id - 1).isActive = true;
    }
    window.scrollTo(0, 100);
    this.cdr.detectChanges();
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

  getJobDetail() {
    let $t = this;
    $t.jobConfig.fetchingJob = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getJob', {
      '{jobId}': $t.jobConfig.jobId,
    });
    if ($t.user) {
      apiUrl = $t.sharedService.urlService.addQueryStringParm(apiUrl, 'user', $t.user.email);
    }
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.jobConfig.job = response.responseObj;
        $t.jobLocations = response.responseObj.locations;
        $t.jobConfig.fetchingJob = false;
      },
      (error) => {
        $t.jobConfig.fetchingJob = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        setTimeout(() => {
          $t.sharedService.uiService.closePopMsg();
          if ($t.user.type === 'Recruiter') {
            $t.router.navigate(['/recruiter/jobs'], { replaceUrl: true });
          } else {
            $t.router.navigate(['/jobs/listings'], { replaceUrl: true });
          }
        }, 2000);
      }
    );
  }

  saveJob(_isFinal?: boolean) {
    let $t = this;
    if (!$t.jobConfig.jobId && $t.jobConfig.job.id === '') {
      _isFinal ? $t.sharedService.uiService.showApiStartPopMsg('Adding Job...') : null;
      let apiUrl = $t.sharedService.urlService.simpleApiCall('createJob');
      $t.sharedService.configService.post(apiUrl, $t.jobConfig.job).subscribe(
        (response: any) => {
          $t.jobConfig.job.id = response.responseObj.id;
          if (_isFinal) {
            $t.sharedService.uiService.showApiSuccessPopMsg('Job Added...');
            $t.sharedService.utilityService.changeMessage('TRIGGER-HEADER-NOTIFICATIONS-UPDATE');
            $t.router.navigate(['/recruiter/jobs']);
          }
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    } else {
      let $t = this;
      _isFinal ? $t.sharedService.uiService.showApiStartPopMsg('Updating Job...') : null;
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('updateJob', { '{jobId}': $t.jobConfig.jobId });
      $t.sharedService.configService.put(apiUrl, $t.jobConfig.job).subscribe(
        (response: any) => {
          if (_isFinal) {
            $t.sharedService.uiService.showApiSuccessPopMsg(response.message);
            $t.sharedService.utilityService.changeMessage('TRIGGER-HEADER-NOTIFICATIONS-UPDATE');
            $t.router.navigate(['/recruiter/jobs']);
          }
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    }
  }

  ngOnInit(): void {
    this.getCountry();
    this.getIndustry();
    if (this.jobConfig.jobId) {
      this.getJobDetail();
    }
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
