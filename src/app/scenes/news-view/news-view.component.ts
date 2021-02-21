import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-news-view',
  templateUrl: './news-view.component.html',
  styleUrls: ['./news-view.component.scss'],
})
export class NewsViewComponent implements OnInit {
  newsConfig: any = {
    newsId: '',
    data: undefined,
    fetchingNews: true,
  };

  constructor(
    private sharedService: SharedService,
    public route: ActivatedRoute,
    public credentialsService: CredentialsService,
    public authenticationService: AuthenticationService
  ) {
    this.newsConfig.newsId = this.route.snapshot.params.newsId;
  }

  getNewsDetail() {
    let $t = this;
    $t.newsConfig.fetchingNews = true;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('getNewsById', {
      '{newsId}': $t.newsConfig.newsId,
    });

    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.newsConfig.data = response;
        $t.newsConfig.fetchingNews = false;
      },
      (error) => {
        $t.newsConfig.fetchingNews = false;
      }
    );
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getNewsDetail();
  }
}
