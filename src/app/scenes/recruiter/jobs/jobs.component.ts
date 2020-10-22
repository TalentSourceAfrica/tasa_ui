import { Component, OnInit, ViewChild } from '@angular/core';
import { delay } from 'rxjs/operators';
import { untilDestroyed } from '@app/@core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

// service
import { SharedService } from '@app/services/shared.service';
import { CredentialsService } from '@app/auth';

// constant
import { courseSearchData } from '@app/models/constants';
import { ShowApplicantsComponent } from '@app/partials/popups/recruiter/show-applicants/show-applicants.component';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit {
  uds: any;
  allJobs: any = [];
  isLoading: boolean = true;
  selectedCourse: any = [];
  length = 100;
  pageSize = 100;
  searchConfig: any = {};
  countries: any = [];
  // chip var
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    public sharedService: SharedService,
    public router: Router,
    public credentialsService: CredentialsService
  ) {
    this.searchConfig = courseSearchData;
    this.uds = this.sharedService.plugins.undSco;
  }

  add(event: MatChipInputEvent, job: any): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      job.tags.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(jobs: any, tagIndex: number): void {
    jobs.tags.splice(tagIndex, 1);
  }

  addJob() {
    this.allJobs.unshift({
      id: '',
      description: '',
      title: '',
      status: '',
      publishOn: '',
      expireOn: '',
      tags: [],
      applicants: [],
      location: '',
      minimumReq: '',
      countOfOpenings: 0,
      experieneceFrom: 0,
      experienceTo: 0,
      createdOn: '',
      updatedOn: '',
      createdBy: this.user.firstName + ' ' + this.user.lastName,
      updatedBy: '',
    });
    // setTimeout(() => {
    //   this.sharedService.utilityService.scrollToElement(`jobPanel-${this.allJobs.length}`);
    // }, 2000);
  }

  createJob(job: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Adding Job...');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('createJob');
    $t.sharedService.configService.post(apiUrl, job).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Jobs Added...');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  updateJob(job: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Updating Job...');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('updateJob', { '{jobId}': job.id });
    $t.sharedService.configService.put(apiUrl, job).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Jobs updated...');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  deleteJob(job: any, jobIndex: number) {
    let $t = this;
    if (job.id != '') {
      $t.sharedService.uiService.showApiStartPopMsg('Deleting Job...!');
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('deleteJob', { '{jobId}': job.id });
      $t.sharedService.configService.delete(apiUrl).subscribe(
        (response: any) => {
          $t.allJobs.splice(jobIndex, 1);
          $t.sharedService.uiService.showApiSuccessPopMsg('Job Deleted...!');
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
        }
      );
    } else {
      $t.allJobs.splice(jobIndex, 1);
    }
  }

  getJobs(_pageIndex: any) {
    this.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getRecruiterPostedJobs', {
      '{recruiterId}': this.user.email,
      '{status}': 'All',
      '{page}': 1,
      '{size}': this.pageSize,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.allJobs = response.responseObj;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getTotalCourseCount() {
    let apiUrl = this.sharedService.urlService.simpleApiCall('getCourseCount');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.length = response.responseObj;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  applyFilter(_pageIndex?: number) {
    let $t = this;
    $t.isLoading = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchCourse', {
      '{page}': _pageIndex || 1,
      '{size}': this.pageSize,
    });
    $t.sharedService.configService.post(apiUrl, $t.searchConfig).subscribe(
      (response: any) => {
        $t.allJobs = response.responseObj.courses;
        $t.length = response.responseObj.count;
        $t.isLoading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkFilter() {
    return Object.values(this.searchConfig).filter((d) => d != '').length;
  }

  removeFilter() {
    this.searchConfig = courseSearchData;
    this.getTotalCourseCount();
    this.getJobs(1);
  }

  pagination(event: any): any {
    this.pageSize = event.pageSize;
    if (this.checkFilter()) {
      this.applyFilter(event.pageIndex + 1);
    } else {
      this.getJobs(event.pageIndex + 1);
    }
  }

  courseView(_key: any) {
    this.router.navigate(['/course/' + _key], { replaceUrl: true });
  }

  checkDisable() {
    return this.allJobs.length ? this.allJobs.filter((d: any) => d.isSelected).length == 0 : true;
  }

  selectCourse(event: any, course: any) {
    event.stopPropagation();
    event.preventDefault();
    course['isSelected'] = course['isSelected'] ? !course['isSelected'] : true;
  }

  showApplicants(job: any, event: any) {
    event.stopPropagation();
    event.preventDefault();
    this.sharedService.dialogService.open(ShowApplicantsComponent, {
      width: '80%',
      data: {
        job: job,
        user: this.user,
      },
      disableClose: false,
    });
  }

  init() {
    this.getJobs(1);
  }

  checkOffset() {
    if (
      jQuery('#filterContent').offset().top + jQuery('#filterContent').height() >=
      jQuery('.footer-wrapper').offset().top - 10
    )
      jQuery('#filterContent').css('position', 'absolute');
    if (jQuery(document).scrollTop() + window.innerHeight < jQuery('.footer-wrapper').offset().top)
      jQuery('#filterContent').css('position', 'fixed');
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  getCountry() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getCountry');

    $t.sharedService.configService.get(apiUrl).subscribe((response) => {
      $t.countries = response;
    });
  }

  ngOnInit(): void {
    this.sharedService.utilityService.requiredStyleForHomeHeader();
    window.scrollTo(0, 0);
    this.init();
    this.getCountry();

    this.sharedService.utilityService.currentMessage.pipe(delay(10), untilDestroyed(this)).subscribe((message) => {
      if (message == 'TRIGGER-RECRUITER-JOBS') {
        this.init();
      }
    });

    if (!this.sharedService.deviceDetectorService.isMobile()) {
      jQuery(document).scroll(() => {
        if (jQuery('.footer-wrapper').length) {
          this.checkOffset();
        } else {
          jQuery('#filterContent').css('position', 'fixed');
        }
      });
    }
  }
  ngOnDestroy(): void {}
}
