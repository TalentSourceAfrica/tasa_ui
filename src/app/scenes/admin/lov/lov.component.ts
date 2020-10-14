import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-lov',
  templateUrl: './lov.component.html',
  styleUrls: ['./lov.component.scss'],
})
export class LovComponent implements OnInit {
  selectedNews: any;
  newsData: any = [];
  constructor(public sharedService: SharedService) {}

  addNews() {
    this.newsData.push({
      id: '',
      image: '',
      description: '',
      fullArticle: '',
      externalLink: '',
      publishedBy: '',
    });
  }

  saveNews(news: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Adding News...!');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('addNews');
    $t.sharedService.configService.post(apiUrl, news).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('news Added...!');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  updateNews(news: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Updating News...!');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('updateNews');
    $t.sharedService.configService.put(apiUrl, news).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('News Updated...!');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  deleteNews(news: any, newsIndex: any) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Deleting News...!');
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('deleteNews', { '{newsId}': news.id });
    $t.sharedService.configService.delete(apiUrl).subscribe(
      (response: any) => {
        $t.newsData.splice(newsIndex, 1);
        $t.sharedService.uiService.showApiSuccessPopMsg('News Deleted...!');
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg(error.error.message);
      }
    );
  }

  getLovs() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getLovs');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.newsData = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    this.getLovs();
  }
}
