import { Component, OnInit } from '@angular/core';
//extra
declare var jQuery: any;

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
})
export class AboutUsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    var $videoModal = jQuery('.video-area-popup');
    $videoModal.modalVideo({
      channel: 'youtube',
    });
  }
}
