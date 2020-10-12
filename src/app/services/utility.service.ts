import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { courseSearchData } from '@app/models/constants';
import { Router } from '@angular/router';
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
    validCharacters: /^[A-Za-z0-9 ]+$/, //Regex for Valid Characters i.e. Alphabets, Numbers and Space.
    iframeUrl:
      '^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$',
  };
  constructor(private http: HttpClient, private router: Router) {}

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
    //To check if user upload any file
    var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
    //The file uploaded is an image
    if (Extension == 'gif' || Extension == 'png' || Extension == 'bmp' || Extension == 'jpeg' || Extension == 'jpg') {
      return true;
    } else {
      return false;
    }
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
        _courseSearchData.subjects = _searchText;
        break;
    }
    this.router.navigate(['/all-course'], { replaceUrl: true });
    localStorage.setItem('tasa-search-course', JSON.stringify(_courseSearchData));
    this.changeMessage('TRIGGER-COURSE-SEARCH');
  }
}
