import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-no-subscription',
  templateUrl: './no-subscription.component.html',
  styleUrls: ['./no-subscription.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NoSubscriptionComponent implements OnInit {
  @Input() message: string = '';
  constructor() {}

  ngOnInit(): void {}
}
