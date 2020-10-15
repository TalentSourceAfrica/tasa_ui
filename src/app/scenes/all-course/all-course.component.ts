import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { filter, delay } from 'rxjs/operators';
import { courseSearchData } from '@app/models/constants';
import { untilDestroyed } from '@app/@core';

// service
import { SharedService } from '@app/services/shared.service';

// component
import { EditCoursePopupComponent } from '@app/partials/popups/course/edit-course-popup/edit-course-popup.component';
import { CredentialsService } from '@app/auth';

@Component({
  selector: 'app-all-course',
  templateUrl: './all-course.component.html',
  styleUrls: ['./all-course.component.scss'],
})
export class AllCourseComponent implements OnInit {
  @ViewChild('filterDrawer', { static: false }) filterDrawer: any;
  allCourse: any = [];
  isLoading: boolean = true;
  selectedCourse: any = [];
  length = 100;
  pageSize = 20;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  filterData: any = {
    tiers: [],
    categories: [],
    levels: ['Introductory', 'Beginner', 'Intermediate', 'Advanced'],
    languages: [],
    subjects: [],
    programs: [],
  };
  searchConfig: any = {};

  constructor(
    public sharedService: SharedService,
    public router: Router,
    public credentialsService: CredentialsService
  ) {
    this.searchConfig = courseSearchData;
  }

  getCourses(_pageIndex: any) {
    this.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getCourse', {
      '{page}': _pageIndex,
      '{size}': this.pageSize,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.allCourse = response.responseObj;
        this.isLoading = false;
        setTimeout(() => {
          if (!this.sharedService.deviceDetectorService.isMobile()) {
            this.filterDrawer.open();
          }
        }, 500);
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

  getFilterData() {
    this.getTiers();
    this.getCategories();
    this.remaningData();
  }

  remaningData() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getFiltersData');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.filterData.levels = response.responseObj.levels;
        $t.filterData.languages = response.responseObj.languages;
        $t.filterData.subjects = response.responseObj.subjects;
        $t.filterData.programs = response.responseObj.programs;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getTiers() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getTiers');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.filterData.tiers = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCategories() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getLovsByGroup', { '{group}': 'categories' });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.filterData.categories = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  applyFilter(_pageIndex?: number) {
    let $t = this;
    if ($t.sharedService.deviceDetectorService.isMobile()) {
      $t.filterDrawer.toggle();
    }
    $t.isLoading = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('searchCourse', {
      '{page}': _pageIndex || 1,
      '{size}': this.pageSize,
    });
    $t.sharedService.configService.post(apiUrl, $t.searchConfig).subscribe(
      (response: any) => {
        $t.allCourse = response.responseObj.courses;
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
    this.getCourses(1);
  }

  pagination(event: any): any {
    this.pageSize = event.pageSize;
    if (this.checkFilter()) {
      this.applyFilter(event.pageIndex + 1);
    } else {
      this.getCourses(event.pageIndex + 1);
    }
  }

  courseView(_key: any) {
    this.router.navigate(['/course/' + _key], { replaceUrl: true });
  }

  checkDisable() {
    return this.allCourse.length ? this.allCourse.filter((d: any) => d.isSelected).length == 0 : true;
  }

  selectCourse(event: any, course: any) {
    event.stopPropagation();
    event.preventDefault();
    course['isSelected'] = course['isSelected'] ? !course['isSelected'] : true;
  }

  openEditCourse() {
    this.sharedService.dialogService.open(EditCoursePopupComponent, {
      width: '100%',
      data: {
        courses: this.allCourse.filter((d: any) => d.isSelected),
        tiers: this.filterData.tiers,
        user: this.user,
      },
      disableClose: false,
    });
  }

  init() {
    this.getFilterData();
    if (localStorage.getItem('tasa-search-course')) {
      this.searchConfig = JSON.parse(localStorage.getItem('tasa-search-course'));
      localStorage.removeItem('tasa-search-course');
      this.applyFilter();
      setTimeout(() => {
        this.filterDrawer.open();
      }, 500);
    } else {
      this.getTotalCourseCount();
      this.getCourses(1);
    }
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

  ngOnInit(): void {
    this.sharedService.utilityService.requiredStyleForHomeHeader();
    window.scrollTo(0, 0);
    this.init();

    this.sharedService.utilityService.currentMessage.pipe(delay(10), untilDestroyed(this)).subscribe((message) => {
      if (message == 'TRIGGER-COURSE-SEARCH') {
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
