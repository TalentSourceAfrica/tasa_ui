import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed } from '@app/@core';
import { delay } from 'rxjs/operators';

//service
import { SocialnetworkService } from '../socialnetwork.service';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import Swal from 'sweetalert2';

// component
import { CreateGroupPopupComponent } from '@app/partials/popups/group/create-group-popup/create-group-popup.component';
import { EditUserPopupComponent } from '@app/partials/popups/authentication/edit-user-popup/edit-user-popup.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
  @ViewChild('conectionDrawer', { static: false }) conectionDrawer: any;
  public userConfig: any = {
    fetchingUser: false,
    user: {},
    tasaId: '',
    isConnected: false,
    totalConnectedUser: 0,
  };
  isCurrentUser: boolean = true;
  mom: any;

  constructor(
    public credentialsService: CredentialsService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    private socialnetworkService: SocialnetworkService,
    private authenticationService: AuthenticationService
  ) {
    this.sharedService.utilityService.changeMessage('FETCH-USER-PROFILE');
    this.mom = this.sharedService.plugins.mom;
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  getDate(_dateToFormat: any) {
    return this.mom(_dateToFormat).format('YYYY-MM-DD');
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
        $t.userConfig.user = response.responseObj;
        $t.userConfig.user.tasaId != $t.user.tasaId ? ($t.isCurrentUser = false) : ($t.isCurrentUser = true);
        if (!$t.isCurrentUser) {
          $t.fetchConnections();
        } else {
          $t.userConfig.fetchingUser = false;
        }
      },
      (error) => {
        $t.userConfig.fetchingUser = false;
      }
    );
  }

  fetchConnections() {
    this.userConfig.isConnected = false;
    this.socialnetworkService.getAllConnections().subscribe(
      (response: any) => {
        if (response && response.connections) {
          this.userConfig.totalConnectedUser = response.connections.length;
          if (response.connections.filter((d: any) => d.tasaId === this.userConfig.tasaId).length) {
            this.userConfig.isConnected = true;
          } else {
            this.userConfig.isConnected = false;
          }
        }
        this.userConfig.fetchingUser = false;
      },
      (error) => {
        this.userConfig.isConnected = false;
        this.userConfig.fetchingUser = false;
        this.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  openCreateGroupPopup() {
    this.sharedService.dialogService.open(CreateGroupPopupComponent, {
      width: '450px',
      data: { authenticationService: this, credentialsService: this.credentialsService, user: this.user },
      disableClose: false,
    });
  }

  editUser(_type: string) {
    let userConfigToUpdate: any = {
      type: _type,
      data: [],
    };
    switch (_type) {
      case 'User Information':
        userConfigToUpdate.data = [
          { label: 'Username', key: 'username' },
          { label: 'Email', key: 'email' },
        ];
        break;
      case 'About':
        userConfigToUpdate.data = [
          { label: 'City', key: 'city', isRequired: true },
          { label: 'Country', key: 'country', isDropdown: true, isRequired: true },
          { label: 'State', key: 'state', isRequired: true },
          { label: 'Date of Birth', key: 'dob', isDateTime: true, isRequired: true },
          { label: 'Preferred Role', key: 'careerGoals' },
          { label: 'Professional Interest', key: 'preferredRole' },
          { label: 'Subjects/Topics of Preference', key: 'areaOfPreference' },
          { label: 'About Me', key: 'bio', textarea: true, isRequired: true },
        ];
        break;
      case 'Contact Information':
        userConfigToUpdate.data = [
          { label: 'Address', key: 'address1' },
          { label: 'City', key: 'city' },
          { label: 'Postal code', key: 'postalCode' },
          { label: 'Country', key: 'country', isDropdown: true },
        ];
        break;
      case 'Experience':
        break;
      case 'Education':
        break;
      case 'Certificate':
        break;
      case 'Freelancer':
        break;
    }

    this.sharedService.dialogService.open(EditUserPopupComponent, {
      width: '700px',
      data: {
        authenticationService: this.authenticationService,
        credentialsService: this.credentialsService,
        userConfigToUpdate: userConfigToUpdate,
      },
      disableClose: false,
    });
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

  connect() {
    let $t = this;
    Swal.fire({
      title: 'Message',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        placeholder: 'Type Your Message',
      },
      showCancelButton: true,
      confirmButtonText: 'Send',
      confirmButtonClass: 'rounded-pill shadow-sm',
      cancelButtonClass: 'rounded-pill shadow-sm',
      showLoaderOnConfirm: true,
      preConfirm: (data) => {
        if (data === '') {
          Swal.showValidationMessage('Please enter message');
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result) {
        if (result.dismiss) {
          Swal.close();
        }
        if (result.value) {
          $t.sharedService.uiService.showApiStartPopMsg('Sending Request...!');
          let apiUrl = $t.sharedService.urlService.apiCallWithParams('sendNetworkConnectionRequest', {
            '{fromUserId}': $t.user.email,
            '{toUserId}': $t.userConfig.user.email,
          });
          $t.sharedService.configService.post(apiUrl, result.value).subscribe(
            (response: any) => {
              $t.sharedService.uiService.showApiSuccessPopMsg('Request Send...!');
            },
            (error) => {
              $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
            }
          );
        }
      }
    });
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {}
}
