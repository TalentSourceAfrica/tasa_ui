import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  courseConfig: any = {
    subjects: [],
  };
  constructor(public sharedService: SharedService, public router: Router) {}

  partnerWithUs() {
    this.sharedService.utilityService.changeMessage('PARTNER-WITH-US');
    this.router.navigate(['/contact-us'], { replaceUrl: true });
  }

  onCourseSearch(searchText: string, type: string) {
    this.sharedService.utilityService.onCourseSearch(searchText, type);
  }

  scrollToFaq(_id: string) {
    this.sharedService.utilityService.scrollToElement(_id);
  }

  fetchCourseFilter() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getFiltersData');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.courseConfig.subjects = response.responseObj.subjects;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.fetchCourseFilter();
  }
}
