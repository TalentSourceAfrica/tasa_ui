import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed } from '@app/@core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('conectionDrawer', { static: false }) conectionDrawer: any;
  public userConfig: any = {
    fetchingUser: false,
    user: {},
    tasaId: '',
  };
  isCurrentUser: boolean = true;
  constructor(
    public credentialsService: CredentialsService,
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) {
    this.sharedService.utilityService.changeMessage('FETCH-USER-PROFILE');
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  fetchUser() {
    let $t = this;
    $t.userConfig.tasaId = $t.route.snapshot.params.tasaId;
    $t.userConfig.fetchingUser = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getUserById', {
      '{tasaId}': $t.userConfig.tasaId,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.userConfig.fetchingUser = false;
        $t.userConfig.user = response;
        $t.userConfig.user.tasaId != this.user.tasaId ? (this.isCurrentUser = false) : (this.isCurrentUser = true);
      },
      (error) => {
        $t.userConfig.fetchingUser = false;
      }
    );
  }

  ngOnInit(): void {
    if (!this.user.image || this.user.image == 'string') {
      this.user.image = 'https://raw.githubusercontent.com/azouaoui-med/pro-sidebar-template/gh-pages/src/img/user.jpg';
    }
    this.sharedService.utilityService.currentMessage.pipe(delay(10), untilDestroyed(this)).subscribe((message) => {
      if (message === 'FETCH-USER-PROFILE') {
        this.fetchUser();
      }
    });
  }

  ngAfterViewInit(): void {
    this.conectionDrawer.open();
  }

  ngOnDestroy(): void {}
}
