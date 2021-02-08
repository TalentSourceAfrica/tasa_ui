import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/auth';
import { OurTeamComponent } from '@app/partials/popups/about-us/our-team/our-team.component';
import { SharedService } from '@app/services/shared.service';

// extra
declare var jQuery: any;

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  constructor(public sharedService: SharedService, private authenticationService: AuthenticationService) {}

  openMyTeam(_name: string, _type: number) {
    this.sharedService.dialogService.open(OurTeamComponent, {
      width: '50%',
      data: { name: _name, type: _type },
      disableClose: false,
    });
  }

  signup() {
    this.authenticationService.openSignupPopup('student', '');
  }

  ngOnInit(): void {
    this.sharedService.utilityService.requiredStyleForHomeHeader();
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {}
}
