import { Component, OnInit } from '@angular/core';
import { CredentialsService, AuthenticationService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-favorite-courses',
  templateUrl: './user-favorite-courses.component.html',
  styleUrls: ['./user-favorite-courses.component.scss'],
})
export class UserFavoriteCoursesComponent implements OnInit {
  uds: any;
  allCourse: any = [];
  constructor(
    public credentialsService: CredentialsService,
    public sharedService: SharedService,
    public authenticationService: AuthenticationService,
    public router: Router
  ) {
    this.allCourse = this.user.favoriteCourses;
    this.uds = this.sharedService.plugins.undSco;
  }

  addToFavorite(_type: boolean, _course: any, event: any) {
    event.stopPropagation();
    event.preventDefault();
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Removing From Favorite...');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('unfavCourse', {
      '{userId}': $t.user.email,
      '{courseKey}': _course.key,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        _course['isFav'] = false;
        $t.user['favoriteCourses'] = $t.user['favoriteCourses'].filter((d: any) => d.key != _course.key);
        $t.allCourse = $t.user['favoriteCourses'];
        $t.authenticationService.login(this.user);
        $t.sharedService.uiService.showApiSuccessPopMsg('Removed From Favorite...');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  courseView(_course: any) {
    this.router.navigate(['/course/' + _course.key], { replaceUrl: true });
  }

  ngOnInit(): void {}

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
