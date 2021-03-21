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
import { Gallery } from 'angular-gallery';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
  @ViewChild('conectionDrawer', { static: false }) conectionDrawer: any;
  @ViewChild('file', { static: false }) public file: any;
  public userConfig: any = {
    fetchingUser: false,
    user: {},
    tasaId: '',
    isConnected: false,
    totalConnectedUser: 0,
    isRequestPending: false,
    currentJob: {},
  };
  isCurrentUser: boolean = true;
  mom: any;
  isAllowedConfig: any = { allowed: true, message: '' }; // when user exceed the subscription plan

  constructor(
    public credentialsService: CredentialsService,
    public sharedService: SharedService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    private socialnetworkService: SocialnetworkService,
    private authenticationService: AuthenticationService,
    private gallery: Gallery
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

  fetchUser(_viewUser?: boolean) {
    let $t = this;
    let apiUrl: any;
    $t.isAllowedConfig.allowed = true;
    $t.userConfig.tasaId = $t.route.snapshot.params.tasaId;
    $t.userConfig.fetchingUser = true;
    $t.userConfig.isConnected = false;
    $t.userConfig.isRequestPending = false;
    if (_viewUser) {
      apiUrl = $t.sharedService.urlService.apiCallWithParams('viewProfile', {
        '{tasaId}': $t.userConfig.tasaId,
      });
    } else {
      apiUrl = $t.sharedService.urlService.apiCallWithParams('getUserById', {
        '{tasaId}': $t.userConfig.tasaId,
      });
    }

    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.userConfig.user = response.responseObj;

        if ($t.userConfig.user.experience.length) {
          $t.userConfig.currentJob = $t.userConfig.user.experience.find((d: any) => d.recentEmployer === 'true') || {};
        }

        $t.userConfig.user.tasaId != $t.user.tasaId ? ($t.isCurrentUser = false) : ($t.isCurrentUser = true);
        $t.fetchConnections();
        if ($t.isCurrentUser) {
          $t.userConfig.fetchingUser = false;
        } else {
          $t.checkIfRequestIsAlreadySend();
        }
      },
      (error) => {
        $t.userConfig.fetchingUser = false;
        if (error.status == 403) {
          $t.isAllowedConfig.allowed = false;
          $t.isAllowedConfig.message = error.error.message;
        }
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  checkIfRequestIsAlreadySend() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getAllNetworkPendingConnections', {
      '{userId}': $t.userConfig.user.email,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        if (response.responseObj.find((d: any) => d.from === $t.user.email)) {
          $t.userConfig.isRequestPending = true;
        } else {
          $t.userConfig.isRequestPending = false;
        }
      },
      (error) => {}
    );
  }

  fetchConnections() {
    this.userConfig.isConnected = false;
    this.socialnetworkService.getAllConnections().subscribe(
      (response: any) => {
        if (response) {
          this.userConfig.totalConnectedUser = response.length;
          if (response.filter((d: any) => d.tasaId === this.userConfig.tasaId).length) {
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

  onFreelanceToggleChange() {
    this.user.isFreelancer === 'Y' ? (this.user.isFreelancer = 'N') : (this.user.isFreelancer = 'Y');
    if (this.user.isFreelancer === 'Y') {
      this.editUser('Freelancer');
    }
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
          { label: 'Professional Interest', key: 'preferredRole', isChips: true },
          { label: 'Subjects/Topics of Preference', key: 'areaOfPreference', isArray: true },
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
        user: this.user,
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
      if (message === 'VIEW-USER-PROFILE') {
        this.fetchUser(true);
      }
    });
  }

  connect() {
    let $t = this;
    Swal.fire({
      title: 'Add A Note',
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
          Swal.showValidationMessage('Please enter a note..!');
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
              $t.userConfig.isRequestPending = true;
            },
            (error) => {
              $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
            }
          );
        }
      }
    });
  }

  showProfilePic(doc: any, index: number) {
    let prop: any = {
      images: [{ path: doc.image }],
      index,
      transitionDuration: 500,
      transitionTimingFunction: 'ease-in',
      arrows: false,
    };
    this.gallery.load(prop);
  }

  getBackgroundImageUrl() {
    if (this.user.backgroundImage) {
      return `url(${this.user.backgroundImage})`;
    } else {
      return `url('https://images.unsplash.com/photo-1508615039623-a25605d2b022?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1050&q=80')`;
    }
  }
  callUpload(event: any) {
    event.stopPropagation();
    event.preventDefault();
    this.file.nativeElement.click();
  }

  handleFileInput(event: any) {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadSingle', { '{email}': $t.user.email });
    apiUrl = $t.sharedService.urlService.addQueryStringParm(apiUrl, 'profile', true);
    let files = event.target.files;
    var form = new FormData();
    form.append('file', files[0], files[0].name);
    if ($t.sharedService.utilityService.ValidateImageUpload(files[0].name)) {
      $t.sharedService.uiService.showApiStartPopMsg('Changing Background...');

      $t.sharedService.configService.post(apiUrl, form).subscribe(
        (response: any) => {
          $t.sharedService.uiService.showApiSuccessPopMsg('Awesome!, Background Updated.');
          $t.user.backgroundImage = response.url;
          $t.authenticationService.login($t.user);
          $t.sharedService.utilityService.changeMessage('FETCH-USER-PROFILE');
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
        }
      );
    } else {
      $t.sharedService.uiService.showApiErrorPopMsg(
        'Uploaded File is not a Valid Image. Only JPG, PNG and JPEG files are allowed.'
      );
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {}
}
