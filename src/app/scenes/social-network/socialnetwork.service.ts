import { Injectable } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocialnetworkService {
  constructor(private sharedService: SharedService, private credentialsService: CredentialsService) {}

  getAllusers():Observable<any> {
    let apiUrl = this.sharedService.urlService.simpleApiCall('getUsers');
    return this.sharedService.configService.get(apiUrl);
    
  }

  getAllConnections() {
    let apiUrl = this.sharedService.urlService.apiCallWithParams('getAllNetworkConnections', {
      '{userId}': this.user.email,
    });
    return this.sharedService.configService.get(apiUrl);
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
