import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CredentialsService } from '@app/auth';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShellComponent implements OnInit {
  isHome: boolean = false;
  constructor(private credentialsService: CredentialsService) {}

  ngOnInit() {}

  get user(): any | null {
    if (location.hash != '#/home') {
      this.isHome = false;
      jQuery('.header-top-area').removeClass('position-absolute');
    } else {
      this.isHome = true;
    }
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
}
