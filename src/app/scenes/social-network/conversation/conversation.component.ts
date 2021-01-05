import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

//extra
declare var jQuery: any;

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConversationComponent implements OnInit {
  message: string = '';
  searchedName: string = '';
  selectedUser: any;
  connectedUserConfig: any = {
    isLoading: false,
    data: [],
  };
  constructor(
    private credentialsService: CredentialsService,
    public sharedService: SharedService,
    private activatedRoute: ActivatedRoute
  ) {}

  // startConnection : '/chat/start/{from}/{to}', // PO
  // sendMessage : '/chat/messages/send', // PO
  // getAllMessages : '/chat/all/{chatId}', // G

  getAllConnections() {
    this.connectedUserConfig.isLoading = true;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getAllNetworkConnections', {
      '{userId}': this.user.email,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.connectedUserConfig.data = response.connections ? response.connections : [];
        const userId = this.activatedRoute.snapshot.queryParamMap.get('userId');
        if (userId) {
          this.selectedUser = this.connectedUserConfig.data.find((d: any) => d.id === userId);
        }
        if (!this.selectedUser || typeof this.selectedUser === 'undefined') {
          this.selectedUser = this.connectedUserConfig.data[0];
        }
        this.startConnection(this.selectedUser);
        this.connectedUserConfig.isLoading = false;
      },
      (error) => {}
    );
  }

  afterUserSelected(_user: any) {
    this.selectedUser = _user;
    this.startConnection(this.selectedUser);
  }

  newMessage() {
    this.message = jQuery('.message-input input').val();
    if (jQuery.trim(this.message) == '') {
      return false;
    }
    jQuery(`<li class="sent"><img src="${this.user.image}" alt="" /><p>' + this.message + '</p></li>`).appendTo(
      jQuery('.messages ul')
    );
    jQuery('.message-input input').val(null);
    jQuery('.contact.active .preview').html('<span>You: </span>' + this.message);
    jQuery('.messages').animate({ scrollTop: jQuery(document).height() }, 'fast');
  }

  startConnection(selectedUser: any) {
    let $t = this;
    let apiUrl = this.sharedService.urlService.apiCallWithParams('startConnection', {
      '{from}': this.user.email,
      '{to}': selectedUser.id,
    });
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error) => {}
    );
  }

  ngOnInit(): void {
    this.getAllConnections();
  }

  ngAfterViewInit(): void {
    jQuery('.messages').animate({ scrollTop: jQuery(document).height() }, 'fast');

    jQuery('#profile-img').click(function () {
      jQuery('#status-options').toggleClass('active');
    });

    jQuery('.expand-button').click(function () {
      jQuery('#profile').toggleClass('expanded');
      jQuery('#contacts').toggleClass('expanded');
    });

    jQuery('#status-options ul li').click(function () {
      jQuery('#profile-img').removeClass();
      jQuery('#status-online').removeClass('active');
      jQuery('#status-away').removeClass('active');
      jQuery('#status-busy').removeClass('active');
      jQuery('#status-offline').removeClass('active');
      jQuery(this).addClass('active');

      if (jQuery('#status-online').hasClass('active')) {
        jQuery('#profile-img').addClass('online');
      } else if (jQuery('#status-away').hasClass('active')) {
        jQuery('#profile-img').addClass('away');
      } else if (jQuery('#status-busy').hasClass('active')) {
        jQuery('#profile-img').addClass('busy');
      } else if (jQuery('#status-offline').hasClass('active')) {
        jQuery('#profile-img').addClass('offline');
      } else {
        jQuery('#profile-img').removeClass();
      }

      jQuery('#status-options').removeClass('active');
    });

    jQuery('.submit').click(() => {
      this.newMessage();
    });

    jQuery(window).on('keydown', (e: any) => {
      if (e.which == 13) {
        this.newMessage();
        return false;
      }
    });
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
