import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-all-course',
  templateUrl: './all-course.component.html',
  styleUrls: ['./all-course.component.scss'],
})
export class AllCourseComponent implements OnInit {
  allCourse: any;
  isLoading: boolean = true;
  constructor(public sharedService: SharedService) {}

  getCourses() {
    let apiUrl = this.sharedService.urlService.simpleApiCall('getAllCourse');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.allCourse = response;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.getCourses();
  }
}
