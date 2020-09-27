import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss'],
})
export class CourseComponent implements OnInit {
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.sharedService.utilityService.requiredStyleForHomeHeader();
  }
}
