import { ViewChild, Component, OnInit } from '@angular/core';
import { jobsSearchData } from '@app/models/constants';
import { PageEvent } from '@angular/material/paginator';
import { SharedService } from '@app/services/shared.service';
import { CredentialsService } from '@app/auth';
import { Router } from '@angular/router';

declare var jQuery: any;

@Component({
  selector: 'app-jobs-admin',
  templateUrl: './jobs-admin.component.html',
  styleUrls: ['./jobs-admin.component.scss'],
})
export class JobsAdminComponent implements OnInit {
  @ViewChild('filterDrawer', { static: false }) filterDrawer: any;
  isLoading: boolean = false;
  length = 100;
  pageSizeOptions: number[] = [10, 20, 50, 100];
  pageEvent: PageEvent;
  allJobs: any = [];
  pageSize = 100;
  filterData: any = {
    tiers: [],
    categories: [],
    levels: ['Introductory', 'Beginner', 'Intermediate', 'Advanced'],
    languages: [],
    subjects: [],
    programs: [],
  };
  isAdmin: boolean = false;
  searchConfig: any = {};
  panelOpenState: boolean = false;
  countries: any = [];
  currentView = 1;

  constructor(
    public sharedService: SharedService,
    public credentialsService: CredentialsService,
    public router: Router
  ) {
    this.searchConfig = JSON.parse(JSON.stringify(jobsSearchData));
  }

   changeAssetView(_view: number) {
    this.currentView = _view;
    setTimeout(() => {
      if (this.currentView == 1) {
      } else if (this.currentView == 2) {
      }
    }, 1);
  }

  applyFilter(_pageIndex?: number) {
    let $t = this;
    if ($t.sharedService.deviceDetectorService.isMobile()) {
      $t.filterDrawer.toggle();
    }
    $t.isLoading = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchJobs', {
      '{page}': _pageIndex || 1,
      '{size}': this.pageSize,
    });
    $t.sharedService.configService.post(apiUrl, $t.searchConfig).subscribe(
      (response: any) => {
        $t.allJobs = response.responseObj.jobs;
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
    this.searchConfig = JSON.parse(JSON.stringify(jobsSearchData));
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

  getCountry() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getCountry');

    $t.sharedService.configService.get(apiUrl).subscribe((response) => {
      $t.countries = response;
    });
  }

  descriptionInfo() {
    jQuery('.job-description').on('mouseover', function (e: any) {
      let description = jQuery(this).attr('data-desc');
      jQuery(this).webuiPopover({
        title: 'Description',
        trigger: 'hover',
        animation: 'pop',
        type: 'html',
        multi: false,
        content: `<div class="max-vertical-h-20 flow-auto stylishScroll">${description}</div>`,
        closeable: true,
        placement: 'right',
        width: '400',
      });
      jQuery(this).webuiPopover('show');
    });
  }

  viewJob(job: any) {
    this.router.navigate(['/job/' + job.id], { replaceUrl: true });
  }

  changeJobStatus(_job: any, _statusToSet: string) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Updating Status...');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('updateJobNew', {
      '{userId}': $t.user.email,
    });
    _job.status = _statusToSet;
    $t.sharedService.configService.put(apiUrl, _job).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Status Updated..!');
        $t.getJobs(1);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
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
        setTimeout(() => {
          this.descriptionInfo();
        }, 1000);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  init() {
  	this.getJobs(1);
    this.getCountry();
  }

  ngOnInit(): void {
    this.init();
  }
}
