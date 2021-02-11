import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-subscription',
  templateUrl: './no-subscription.component.html',
  styleUrls: ['./no-subscription.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NoSubscriptionComponent implements OnInit {
  @Input() message: string = '';
  @Input() isComingFrom: string = '';
  constructor( private router:Router) {}

  redirect(){
    if(this.isComingFrom === 'course'){
      this.router.navigate(['/all-course'], { replaceUrl: true });
    }
    if(this.isComingFrom === 'subscription'){
      this.router.navigate(['/subscription-plans'], { replaceUrl: true });
    }
   
  }
  ngOnInit(): void {}
}
