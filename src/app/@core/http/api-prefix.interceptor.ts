import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';

/**
 * Prefixes all requests not starting with `http[s]` with `environment.serverUrl`.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  public downloadableUrls: any = {
    '/tasaapi/v1/transactions/download/': {
      fileName: 'Invoice',
      fileType: 'pdf',
      mimeType: 'application/pdf;charset=utf-8'
    },
  };

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const url = request.url.substring(request.url.indexOf('api') - 1).replace(/[/]\d+/g, '/:id');
    const file = url.toLowerCase().match(/(\w+).(jpg|jpeg|png|dbf|pdf|xlsx|msg|tiff|csv|txt|mht|eml|htm|tsv|xls)/);
    if (request.url.indexOf('download') !== -1 && (request.method === 'GET' || request.method === 'POST')) {
      request = request.clone({
        responseType: 'arraybuffer',
      });
    } else if (file && file.length) {
      request = request.clone({
        responseType: 'blob',
      });
    }

    if (!/^(http|https):/i.test(request.url)) {
      request = request.clone({ url: environment.serverUrl + request.url });
    }
    return next.handle(request);
  }
}
