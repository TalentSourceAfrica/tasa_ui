import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isAdmin: boolean = false;
  uds: any;
  postData: any = [];
  courses: any = [];
  recommendedCourses: any = [];
  jobApplications: any = [];
  postOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    smartSpeed: 1000,
    dots: true,
    autoHeight: true,
    autoWidth: true,
    autoplayHoverPause: true,
    nav: false,
    navText: ["<i class='fas fa-3x fa-chevron-circle-left'></i>", "<i class='fas fa-3x fa-chevron-circle-right'></i>"],
    autoplayTimeout: 3000,
    responsive: {
      0: {
        items: 1,
      },
    },
  };

  courseOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    center: true,
    smartSpeed: 1000,
    dots: true,
    autoHeight: true,
    autoWidth: true,
    autoplayHoverPause: true,
    nav: false,
    navText: ["<i class='fas fa-3x fa-chevron-circle-left'></i>", "<i class='fas fa-3x fa-chevron-circle-right'></i>"],
    autoplayTimeout: 3000,
    responsive: {
      0: {
        items: 1,
      },
      300: {
        items: 2,
      },
      600: {
        items: 3,
      },
      900: {
        items: 4,
      },
    },
  };

  constructor(
    public sharedService: SharedService,
    private router: Router,
    private credentialsService: CredentialsService
  ) {
    this.user.type.toLowerCase() == 'admin' ? (this.isAdmin = true) : (this.isAdmin = false);
    this.uds = this.sharedService.plugins.undSco;
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  getPosts() {
    let $t = this;
    let apiUrl = '';
    apiUrl = $t.sharedService.urlService.simpleApiCall('getPost');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.postData = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getCourses() {
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getCourse', {
      '{page}': 1,
      '{size}': 10,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.courses = response.responseObj;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  courseView(_key: any) {
    this.router.navigate(['/course/' + _key], { replaceUrl: true });
  }

  getJobsApplications() {
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getJobApplications', {
      '{userId}': this.user.email,
      '{page}': 0,
      '{size}': 0,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.jobApplications = response.responseObj;
        this.uds.each(this.jobApplications, (d: any) => {
          d['jobStatus'] = d.applicants.find((app: any) => app.userId == this.user.email).status;
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getRecommendedCourse() {
    let $t = this;
    let apiUrl = '';
    apiUrl = $t.sharedService.urlService.apiCallWithParams('getRecommendedCourse', { '{userId}': $t.user.email });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.recommendedCourses = response.responseObj;
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

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getPosts();
    this.getCourses();
    this.getRecommendedCourse();
    this.getJobsApplications();
  }
}
