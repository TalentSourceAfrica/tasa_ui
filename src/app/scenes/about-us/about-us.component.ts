import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';
//extra
declare var jQuery: any;

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  constructor(public sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.utilityService.requiredStyleForHomeHeader();
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {
    var $videoModal = jQuery('.video-area-popup');
    $videoModal.modalVideo({
      channel: 'youtube',
    });
  }
}
