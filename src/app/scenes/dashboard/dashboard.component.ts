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
  showFiller = false;
  postData: any = [];
  courses: any = [];
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

  jobList = [
    {
      jobTitle: 'Frontend Developer',
      jobStatus: 'Active',
      jobTags: ['javascript', 'Angular', 'HTML5'],
      jobLocation: 'Africa',
    },
    {
      jobTitle: 'Devops Developer',
      jobStatus: 'Active',
      jobTags: ['Jenkins', 'Aws', 'Elastic Search'],
      jobLocation: 'Africa',
    },
    {
      jobTitle: 'Backend Developer',
      jobStatus: 'Inactive',
      jobTags: ['Java', 'MongoDb', 'Socket'],
      jobLocation: 'Africa',
    },
    {
      jobTitle: 'Devops Developer',
      jobStatus: 'Active',
      jobTags: ['Jenkins', 'Aws', 'Elastic Search'],
      jobLocation: 'Africa',
    },
    {
      jobTitle: 'Backend Developer',
      jobStatus: 'Inactive',
      jobTags: ['Java', 'MongoDb', 'Socket'],
      jobLocation: 'Africa',
    },
  ];
  constructor(
    public sharedService: SharedService,
    private router: Router,
    private credentialsService: CredentialsService
  ) {}

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

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getPosts();
    this.getCourses();
  }
}
