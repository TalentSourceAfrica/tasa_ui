import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { Observable, forkJoin } from 'rxjs';

//extra
declare var jQuery: any;

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConversationComponent implements OnInit {
  @ViewChild('audioOption', { static: false }) audioPlayerRef: ElementRef;
  @ViewChild('imageFileUpload', { static: false }) imageFileUpload: any;
  @ViewChild('videoFileUpload', { static: false }) videoFileUpload: any;
  attachmentConfig: any = {
    fileType: '',
    file: '',
  };
  uds: any;
  searchedName: string = '';
  pollingInterval: any;
  connectedUserConfig: any = {
    isLoading: false,
    data: [],
  };
  connectionConfig: any = {
    selectedUser: undefined,
    currentConnection: undefined,
    currentMsgList: [],
  };
  constructor(
    private credentialsService: CredentialsService,
    public sharedService: SharedService,
    private activatedRoute: ActivatedRoute
  ) {
    this.uds = this.sharedService.plugins.undSco;
  }

  // startConnection : '/chat/start/{from}/{to}', // PO
  // sendMessage : '/chat/messages/send', // PO
  // getAllMessages : '/chat/all/{chatId}', // G

  getAllConnections() {
    let $t = this;
    $t.connectedUserConfig.isLoading = true;
    let api1: any;
    let api2: any;

    let apiUrl1 = $t.sharedService.urlService.apiCallWithParams('getAllNetworkConnections', {
      '{userId}': $t.user.email,
    });
    let apiUrl2 = $t.sharedService.urlService.apiCallWithParams('myConnections', {
      '{userId}': $t.user.email,
    });

    api1 = $t.sharedService.configService.get(apiUrl1);
    api2 = $t.sharedService.configService.get(apiUrl2);
    forkJoin([api1, api2]).subscribe(
      (results: any) => {
        console.log(results);
        const result1 = results[0];
        const result2 = results[1].responseObj;
        const userId = this.activatedRoute.snapshot.queryParamMap.get('userId');
        let getChatId = (d: any) => {
          if (result2.filter((data: any) => data.from === d.id || data.to === d.id).length) {
            return result2.find((data: any) => data.from === d.id || data.to === d.id).id;
          } else {
            return null;
          }
        };
        if (result1.connections.length === 0 && result2.length === 0) {
          $t.connectedUserConfig.data = [];
        } else {
          $t.uds.each(result1.connections, (d: any) => {
            $t.connectedUserConfig.data.push({
              firstName: d.firstName,
              id: d.id,
              imageUrl: d.imageUrl,
              lastName: d.lastName,
              summary: d.summary,
              tasaId: d.tasaId,
              chatId: getChatId(d),
            });
          });
          if (userId) {
            $t.connectionConfig.selectedUser = $t.connectedUserConfig.data.find((d: any) => d.id === userId);
            if ($t.connectionConfig.selectedUser.chatId) {
              $t.getAllChatByChatId();
              $t.pollingForChat();
            } else {
              $t.startConnection($t.connectionConfig.selectedUser);
            }
          }
        }
        $t.connectedUserConfig.isLoading = false;
        console.log($t.connectedUserConfig);
      },
      (error) => {
        $t.connectedUserConfig.isLoading = false;
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
    // this.sharedService.configService.get(apiUrl1).subscribe(
    //   (response: any) => {
    //     this.connectedUserConfig.data = response.connections ? response.connections : [];
    //     const userId = this.activatedRoute.snapshot.queryParamMap.get('userId');
    //     if (userId) {
    //       this.connectionConfig.selectedUser = this.connectedUserConfig.data.find((d: any) => d.id === userId);
    //     }
    //     if (!this.connectionConfig.selectedUser || typeof this.connectionConfig.selectedUser === 'undefined') {
    //       this.connectionConfig.selectedUser = this.connectedUserConfig.data[0];
    //     }
    //     // this.startConnection(this.connectionConfig.selectedUser);
    //     this.connectedUserConfig.isLoading = false;
    //   },
    //   (error) => {}
    // );
  }

  afterUserSelected(_user: any) {
    this.connectionConfig.selectedUser = _user;
    if (_user.chatId == null) {
      this.startConnection(this.connectionConfig.selectedUser);
    } else {
      this.getAllChatByChatId();
    }
  }

  newMessage() {
    let $t = this;
    let payload: any = '';
    const message = jQuery('.message-input input').val();
    if (jQuery.trim(message) == '') {
      return false;
    }
    payload = {
      id: '',
      chatId: $t.connectionConfig.selectedUser.chatId,
      message: message,
      contentType: $t.attachmentConfig.fileType,
      contentUrl: $t.attachmentConfig.file,
      from: $t.user.email,
      to: $t.connectionConfig.selectedUser.id,
      sentOn: '',
      status: 'SENT',
    };

    let apiUrl = $t.sharedService.urlService.simpleApiCall('sendMessage');
    $t.sharedService.configService.post(apiUrl, payload).subscribe(
      (response: any) => {
        jQuery('.message-input input').val(null);
        $t.attachmentConfig.fileType = '';
        $t.attachmentConfig.file = '';
        $t.getAllChatByChatId();
      },
      (error) => {}
    );
  }

  startConnection(selectedUser: any) {
    let $t = this;
    $t.connectionConfig.currentMsgList = [];
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('startConnection', {
      '{from}': $t.user.email,
      '{to}': selectedUser.id,
    });
    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {
        console.log(response);
        $t.connectionConfig.selectedUser.chatId = response.id;
        $t.getAllChatByChatId();
      },
      (error) => {}
    );
  }

  getAllChatByChatId() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getAllMessages', {
      '{chatId}': $t.connectionConfig.selectedUser.chatId,
    });
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.connectionConfig.currentMsgList = response.responseObj.reverse();
        setTimeout(() => {
          document.querySelector('.last-msg').scrollIntoView({
            behavior: 'smooth',
          });
        }, 500);
        $t.readMessages();
        setTimeout(() => {
          $t.pollingForChat();
        }, 1000);
      },
      (error) => {}
    );
  }

  getAllNewChatByChatIdAndUserId() {
    let $t = this;
    if ($t.connectionConfig.selectedUser) {
      let apiUrl = $t.sharedService.urlService.apiCallWithParams('getAllNewMessages', {
        '{chatId}': $t.connectionConfig.selectedUser.chatId,
        '{userId}': $t.user.email,
      });
      $t.sharedService.configService.get(apiUrl).subscribe(
        (response: any) => {
          if (response.responseObj.length) {
            $t.audioPlayerRef.nativeElement.play();
            // $t.uds.each(response,(d:any) => {
            //   $t.connectionConfig.currentMsgList.push(d);
            // })
            $t.getAllChatByChatId();
          }
        },
        (error) => {}
      );
    }
  }

  readMessages() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('readMessages', {
      '{chatId}': $t.connectionConfig.selectedUser.chatId,
    });
    $t.sharedService.configService.post(apiUrl).subscribe(
      (response: any) => {},
      (error) => {}
    );
  }

  downloadChatFile(_type: string, _link: any) {
    switch (_type) {
      case 'image':
        this.sharedService.utilityService.downloadImage(_link);
        break;
      case 'video':
        break;
    }
  }

  sendMedia(_type: string) {
    switch (_type) {
      case 'image':
        this.imageFileUpload.nativeElement.click();
        break;
      case 'video':
        this.videoFileUpload.nativeElement.click();
        break;
    }
  }

  pollingForChat() {
    if (this.connectionConfig.selectedUser) {
      this.pollingInterval = setInterval(() => {
        this.getAllNewChatByChatIdAndUserId();
      }, 25000);
    }
  }

  uploadFile(_event: any, _case: string) {
    let $t = this;
    let isImage = false;
    let isVideo = false;
    let isOther = false;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadSingle', { '{email}': $t.user.email });
    let files = _event.target.files;
    var form = new FormData();
    let imageTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
    let videoTypes = ['video/mp4', 'video/mov', 'video/wmv', 'video/flv', 'video/avi', 'video/webm'];
    if (_case == 'image') {
      if (imageTypes.indexOf(files[0].type) != -1) {
        isImage = true;
      } else {
        $t.sharedService.uiService.showApiErrorPopMsg(
          'Incorrect file chosen, please choose an image (.jpeg, .jpg, .gif, .png)'
        );
        return;
      }
    } else {
      if (videoTypes.indexOf(files[0].type) != -1) {
        isVideo = true;
      } else {
        $t.sharedService.uiService.showApiErrorPopMsg(
          'Incorrect file chosen, please choose a video (.mp4, .mov, .wmv, .flv, .avi, .webm)'
        );
        return;
      }
    }
    $t.sharedService.uiService.showApiStartPopMsg('Adding File...');
    form.append('file', files[0], files[0].name);
    $t.sharedService.configService.post(apiUrl, form).subscribe(
      (response: any) => {
        $t.sharedService.uiService.closePopMsg();
        $t.attachmentConfig.fileType = _case;
        $t.attachmentConfig.file = response.url;
        $t.sharedService.uiService.showMessage('File Added...');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
      }
    );
  }

  ngOnInit(): void {
    this.getAllConnections();
  }

  ngAfterViewInit(): void {
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
  }

  ngOnDestroy(): void {
    this.connectionConfig.selectedUser = undefined;
    // clearInterval(this.pollingInterval);
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
