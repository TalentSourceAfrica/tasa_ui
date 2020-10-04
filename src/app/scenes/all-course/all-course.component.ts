import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-course',
  templateUrl: './all-course.component.html',
  styleUrls: ['./all-course.component.scss'],
})
export class AllCourseComponent implements OnInit {
  allCourse: any;
  isLoading: boolean = true;
  constructor(public sharedService: SharedService, public router: Router) {}

  getCourses() {
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getCourse', {
      '{page}': 1,
      '{size}': 50,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.allCourse = response.responseObj;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  courseView(_key: any) {
    this.router.navigate(['/course/' + _key], { replaceUrl: true });
  }

  ngOnInit(): void {
    this.getCourses();
  }
}
