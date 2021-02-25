import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShellComponent implements OnInit {
  isHome: boolean = false;
  showHeader: boolean = true;
  constructor(private credentialsService: CredentialsService, public sharedService: SharedService) {}

  ngOnInit() {
    this.sharedService.utilityService.currentMessage.pipe().subscribe((message) => {
      if (message === 'AFTER-LOGIN') {
        this.showHeader = true;
      }
      if (message === 'BEFORE-LOGIN') {
        this.showHeader = false;
      }
    });
  }

  get user(): any | null {
    if (location.hash != '#/home') {
      this.isHome = false;
    } else {
      this.isHome = true;
    }
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
