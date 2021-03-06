import { Component, OnInit } from '@angular/core';
import { untilDestroyed } from '@app/@core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-right-side',
  templateUrl: './right-side.component.html',
  styleUrls: ['./right-side.component.scss'],
})
export class RightSideComponent implements OnInit {
  newsConfig: any = {
    isFetching: false,
    data: [],
  };

  constructor(public sharedService: SharedService, private credentialsService: CredentialsService) {}

  getNews() {
    this.newsConfig.isFetching = true;
    let apiUrl = this.sharedService.urlService.simpleApiCall('getNews');
    this.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        this.newsConfig.data = response;
        this.newsConfig.isFetching = false;
      },
      (error) => {
        this.newsConfig.isFetching = false;
      }
    );
  }

  ngOnInit(): void {
    this.getNews();
  }

  ngOnDestroy(): void {}

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
