import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
import { CredentialsService } from '@app/auth';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  @ViewChild('newsfile', { static: false }) public newsfile: any;
  selectedNews: any;
  suportedImage = ['.gif', '.png', '.bmp', '.jpeg', '.jpg'];
  newsData: any = [];
  constructor(public sharedService: SharedService, public credentialsService: CredentialsService) {}

  addNews() {
    this.newsData.unshift({
      id: '',
      image: '',
      description: '',
      fullArticle: '',
      externalLink: '',
      publishedBy: '',
    });
  }

  uploadImage(news: any) {
    this.selectedNews = news;
    this.newsfile.nativeElement.click();
  }

  handleFileInput(event: any) {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadSingle', { '{email}': $t.user.email });
    let files = event.target.files;
    var form = new FormData();
    form.append('file', files[0], files[0].name);
    if ($t.sharedService.utilityService.ValidateImageUpload(files[0].name)) {
      $t.sharedService.uiService.showApiStartPopMsg('Adding Image ...');

      $t.sharedService.configService.post(apiUrl, form).subscribe(
        (response: any) => {
          $t.selectedNews.image = response.data;
          $t.sharedService.uiService.showApiSuccessPopMsg('Image Added...');
        },
        (error) => {
          $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
        }
      );
    } else {
      $t.sharedService.uiService.showApiErrorPopMsg(
        'Uploaded File is not a Valid Image. Only JPG, PNG and JPEG files are allowed.'
      );
    }
  }

  saveNews(news: any, newsIndex: number) {
    let $t = this;
    $t.sharedService.uiService.showApiStartPopMsg('Adding News...!');
    let apiUrl = $t.sharedService.urlService.simpleApiCall('addNews');
    $t.sharedService.configService.post(apiUrl, news).subscribe(
      (response: any) => {
        $t.newsData[newsIndex] = response;
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
    if (news.id != '') {
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
    } else {
      $t.newsData.splice(newsIndex, 1);
    }
  }

  getNews() {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.simpleApiCall('getNews');
    $t.sharedService.configService.get(apiUrl).subscribe(
      (response: any) => {
        $t.newsData = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }

  ngOnInit(): void {
    this.getNews();
  }
}
