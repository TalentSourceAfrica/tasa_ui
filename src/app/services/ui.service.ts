// core
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

// services

import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

// jquery and extras
declare var jQuery: any;

@Injectable({
  providedIn: 'root',
})
export class UiService {
  isLoggedIn$: Observable<boolean>;

  constructor(public router: Router, public snackBar: MatSnackBar) {}

  showMessage(msg: any): void {
    this.snackBar.open(msg, '', { duration: 4000 });
  }

  showSimplePopMsg(msgType: any, msgTitle: any, msg: any): void {
    Swal.fire({
      title: msgTitle, // title of the modal
      text: msg, // description of the modal
      type: msgType, // warning, error, success, info, and question,
      backdrop: true,
    });
  }

  showSimplePopMsgWithHTML(msgType: any, msgTitle: any, msgHtml: any, msg: any): void {
    Swal.fire({
      title: msgTitle, // description of the modal
      text: msg, // title of the modal
      html: msgHtml,
      type: msgType, // warning, error, success, info, and question,
      backdrop: true,
    });
  }

  closePopMsg() {
    Swal.close();
  }

  showApiStartPopMsg(msg: any): void {
    Swal.fire({
      title: msg, // title of the modal
      text: 'Please wait ...', // description of the modal
      imageUrl: 'assets/loaders/swal-loader.gif',
      imageWidth: 125,
      imageHeight: 125,
      type: null,
      backdrop: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false,
      showCancelButton: false,
    });
  }

  showApiSuccessPopMsg(msg: any, timer?: number): void {
    Swal.fire({
      title: msg, // title of the modal
      text: '', // description of the modal
      type: 'success', // warning, error, success, info, and question,
      backdrop: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      allowEnterKey: true,
      timer: timer || 2000,
    });
  }

  showApiErrorPopMsg(msg: any): void {
    Swal.fire({
      title: msg, // title of the modal
      text: '', // description of the modal
      type: 'error', // warning, error, success, info, and question,
      backdrop: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      allowEnterKey: true,
    });
  }
}
