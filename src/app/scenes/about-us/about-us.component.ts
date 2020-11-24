import { Component, OnInit } from '@angular/core';
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
  constructor(public sharedService: SharedService) {}

  openMyTeam(_name: string, _type: number) {
    this.sharedService.dialogService.open(OurTeamComponent, {
      width: '50%',
      data: { name: _name, type: _type },
      disableClose: false,
    });
  }

  ngOnInit(): void {
    this.sharedService.utilityService.requiredStyleForHomeHeader();
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {}
}
