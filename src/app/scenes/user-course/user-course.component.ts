import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsService } from '@app/auth';

@Component({
  selector: 'app-user-course',
  templateUrl: './user-course.component.html',
  styleUrls: ['./user-course.component.scss'],
})
export class UserCourseComponent implements OnInit {
  myCourses: any = [];
  constructor(private credentialsService: CredentialsService, private router: Router) {}
  
  courseView(_course: any) {
    this.router.navigate(['/course/' + _course.key], { replaceUrl: true });
  }

  ngOnInit(): void {
    this.myCourses = this.user.enrolledCourses;
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
