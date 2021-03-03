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

  userProgressConfig: any = {
    percent: 0,
    radius: 60,
    outerColor: '#523f6d',
    innerColor: '#a39ab238',
    title: 'Complete',
    totalCommonFields: [
      {
        filedName: 'bio',
        isValuePresent: false,
      },
      {
        filedName: 'areaOfPreference',
        isValuePresent: false,
      },
      {
        filedName: 'careerGoals',
        isValuePresent: false,
      },
      {
        filedName: 'experience',
        isValuePresent: false,
        totalInsideFields: 3,
      },
      {
        filedName: 'education',
        isValuePresent: false,
        totalInsideFields: 4,
      },
      {
        filedName: 'certificate',
        isValuePresent: false,
      },
      {
        filedName: 'city',
        isValuePresent: false,
      },
      {
        filedName: 'state',
        isValuePresent: false,
      },
      {
        filedName: 'country',
        isValuePresent: false,
      },
    ],
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

  calculateProfileProgress() {
    let $t = this;
    if ($t.user.type === 'Mentee') {
      let totalFieldCount = $t.userProgressConfig.totalCommonFields.length;
      if ($t.user.isFreelancer === 'Y') {
        const freelanceFields = [
          {
            filedName: 'pastGigs',
            isValuePresent: false,
            totalInsideFields: 4,
          },
        ];
        $t.userProgressConfig.totalCommonFields = [...$t.userProgressConfig.totalCommonFields, ...freelanceFields];
      }

      $t.userProgressConfig.totalCommonFields.forEach((element: any) => {
        if (
          element.filedName === 'experience' ||
          element.filedName === 'pastGigs' ||
          element.filedName === 'areaOfPreference' ||
          element.filedName === 'education' ||
          element.filedName === 'certificate'
        ) {
          $t.user[element.filedName].length ? (element.isValuePresent = true) : (element.isValuePresent = false);
        } else {
          $t.user[element.filedName] !== '' ? (element.isValuePresent = true) : (element.isValuePresent = false);
        }
      });
      $t.userProgressConfig.percent =
        $t.userProgressConfig.totalCommonFields.filter((d: any) => d.isValuePresent).length / totalFieldCount;

      $t.userProgressConfig.percent = $t.userProgressConfig.percent * 100;

      if ($t.userProgressConfig.percent <= 50) {
        $t.userProgressConfig.outerColor = '#aa2b1d';
        $t.userProgressConfig.innerColor = '#fa1e0e';
      } else if ($t.userProgressConfig.percent > 50 && $t.userProgressConfig.percent <= 80) {
        $t.userProgressConfig.outerColor = '#025955';
        $t.userProgressConfig.innerColor = '#99bbad';
      } else if ($t.userProgressConfig.percent > 80) {
        $t.userProgressConfig.outerColor = '#523f6d';
        $t.userProgressConfig.innerColor = '#a39ab238';
      }
    }
  }

  ngOnInit(): void {
    this.getNews();
    this.calculateProfileProgress();
    this.sharedService.utilityService.currentMessage.pipe(delay(10), untilDestroyed(this)).subscribe((message) => {
      if (message === 'FETCH-USER-PROFILE') {
        this.calculateProfileProgress();
      }
    });
  }

  ngOnDestroy(): void {}

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
