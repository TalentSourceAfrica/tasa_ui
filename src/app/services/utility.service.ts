import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { courseSearchData, jobsSearchData, localStorageKeys } from '@app/models/constants';
import { Router } from '@angular/router';
import { UiService } from './ui.service';
declare var jQuery: any;

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();
  CustomValidators = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    phoneNumber: /^[0]?[6789]\d{9}$/,
    pincode: /^[1-9][0-9]{5}$/,
    panNumber: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
    password: /^(?![\s])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w])([^\s]){8,}$/,
    tinNumber: /^\d{9,16}$/,
    onlyChars: /^[a-zA-Z ]*$/,
    euinNo: /^([a-zA-Z]){1}(\d){6}$/,
    userName: /^([a-zA-Z0-9]){4,}$/,
    integer: /^\d+$/,
    positiveInteger: /^\d+$/,
    decimal: /^[-+]?[0-9]+\.[0-9]+$/,
    onlyNumber: /^\d+$/,
    validCharacters: /^[A-Za-z0-9 ]+$/, // Regex for Valid Characters i.e. Alphabets, Numbers and Space.
    iframeUrl:
      '^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$',
  };

  constructor(private router: Router, private uiService: UiService) {}

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  getCustomValidators() {
    return this.CustomValidators;
  }

  isPositiveInteger(data: any) {
    if (data && !isNaN(Number(data))) {
      return this.CustomValidators.positiveInteger.test(data);
    } else {
      return false;
    }
  }

  isInteger(data: any) {
    if (data && !isNaN(Number(data))) {
      return Number.isInteger(Number(data));
    } else {
      return false;
    }
  }

  isDecimal(data: any) {
    if (data && !isNaN(Number(data))) {
      if (Number.isInteger(Number(data))) {
        return true;
      } else {
        return this.CustomValidators.decimal.test(data);
      }
    } else {
      return false;
    }
  }

  isString(data: any) {
    if (data) {
      return isNaN(Number(data));
    } else {
      return false;
    }
  }

  ifSpecialCharacters(data: any) {
    if (data) {
      return !this.CustomValidators.validCharacters.test(data);
    } else {
      return false;
    }
  }

  encodeEntitiies(enitity: any) {
    return enitity != null && enitity != ''
      ? enitity.replace(/[!@#$%^&*(){}\[\]\|\\]/g, '&lt;').replace(/[!@#$%^&*(){}\[\]\|\\]/g, '&gt;')
      : enitity;
  }

  decodeEntitiies(enitity: any) {
    return enitity != null && enitity != '' ? enitity.replace(/&lt;/g, '<').replace(/&gt;/g, '>') : enitity;
  }

  scrollToElement(_elementId: string) {
    jQuery([document.documentElement, document.body]).animate(
      {
        scrollTop: jQuery('#' + _elementId).offset().top,
      },
      2000
    );
  }

  scrollToBottom(_parentId: any) {
    var objDiv = document.getElementById(_parentId);
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  ValidateImageUpload(FileUploadPath: any) {
    var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
    if (Extension == 'gif' || Extension == 'png' || Extension == 'bmp' || Extension == 'jpeg' || Extension == 'jpg') {
      return true;
    } else {
      return false;
    }
  }

  ValidateResumeUpload(FileUploadPath: any) {
    var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
    if (Extension == 'pdf' || Extension == 'doc' || Extension == 'docx' || Extension == 'psd') {
      return true;
    } else {
      return false;
    }
  }

  ValidateCertificateUpload(FileUploadPath: any) {
    var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
    if (Extension == 'pdf' || Extension == 'png' || Extension == 'jpeg' || Extension == 'jpg') {
      return { result: true, type: Extension === 'pdf' ? 'pdf' : 'image' };
    } else {
      return { result: false };
    }
  }

  downloadImage(_href: string) {
    var a = document.createElement('a');
    a.href = _href;
    a.download = 'image';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  downloadURI(uri: string) {
    let link: any = document.createElement('a');
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  openLinkInNewTab(_href: string) {
    var a = document.createElement('a');
    a.href = _href;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  isValidIframeUrl(_urlString: string) {
    var regexQuery = this.CustomValidators.iframeUrl;
    var url = new RegExp(regexQuery, 'i');
    return url.test(_urlString);
  }

  replaceUnderscoresWithSpaces(str: string) {
    return typeof str !== 'undefined' && str.length ? str.replace(/_/g, ' ') : '';
  }

  camelize(str: any) {
    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word: any, index: any) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
  }

  uuidv4Generator() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  public flattenApiResponse(_response: any) {
    let $t = this;
    let manipulatedDataEntry: any = {};
    manipulatedDataEntry = {};
    Object.keys(_response).forEach((val: any, valkey: any) => {
      if (jQuery.isPlainObject(_response[val])) {
        if (Object.keys(_response[val]).length) {
          Object.keys(_response[val]).forEach((v: any, vk: any) => {
            manipulatedDataEntry[v] = _response[val][v];
          });
        } else {
          manipulatedDataEntry[val] = _response[val];
        }
      } else {
        manipulatedDataEntry[val] = _response[val];
      }
    });
    return manipulatedDataEntry;
  }

  public requiredStyleForHomeHeader() {
    jQuery('.mainmenu-area').css({ background: '#867899' });
    jQuery('.header-top-area').css({ position: 'relative' });
  }

  public onCourseSearch(_searchText: string, _type: string) {
    const _courseSearchData = JSON.parse(JSON.stringify(courseSearchData));
    switch (_type) {
      case 'text':
        _courseSearchData.text = _searchText;
        break;
      case 'subject':
        _courseSearchData.subject = _searchText;
        break;
    }
    localStorage.setItem(localStorageKeys.courseSearchKey, JSON.stringify(_courseSearchData));
    jQuery('.header-top-area').removeClass('position-absolute');
    this.router.navigate(['/all-course'], { replaceUrl: true });
    if (this.router.url === '/all-course') {
      this.changeMessage('TRIGGER-COURSE-SEARCH');
    }
  }

  public onGigSearch(_searchText: string) {
    localStorage.setItem(localStorageKeys.gigSearchKey, JSON.stringify(_searchText));
    jQuery('.header-top-area').removeClass('position-absolute');
    this.router.navigate(['/freelance/all-gigs'], { replaceUrl: true });
    this.changeMessage('TRIGGER-GIG-SEARCH');
  }

  public onJobSearch(_searchText: string) {
    const _jobsSearchData = JSON.parse(JSON.stringify(jobsSearchData));
    _jobsSearchData.text = _searchText;
    localStorage.setItem(localStorageKeys.jobSearchKey, JSON.stringify(_jobsSearchData));
    jQuery('.header-top-area').removeClass('position-absolute');
    this.router.navigate(['/jobs/listings'], { replaceUrl: true });
    this.changeMessage('TRIGGER-JOB-SEARCH');
  }

  public onRedirect(_user: any, _module: string, _routerEndPath: string) {
    const $t = this;
    switch (_module) {
      case 'freelance':
        let _callBackRedirection = () => {
          $t.router.navigate(['/social-network/profile/', _user.tasaId], { replaceUrl: true });
        };
        if (_user.isFreelancer !== 'Y') {
          $t.uiService.showApiErrorPopMsgWithTwoActions(
            'You are not a freelancer, Please registered as freelancer.',
            'Go to profile',
            _callBackRedirection
          );
        } else {
          $t.router.navigate([`/freelance/${_routerEndPath}/`], { replaceUrl: true });
        }
        break;
    }
  }
}
