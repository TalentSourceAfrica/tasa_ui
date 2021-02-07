import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoSubscriptionComponent } from './no-subscription.component';

describe('NoSubscriptionComponent', () => {
  let component: NoSubscriptionComponent;
  let fixture: ComponentFixture<NoSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoSubscriptionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
