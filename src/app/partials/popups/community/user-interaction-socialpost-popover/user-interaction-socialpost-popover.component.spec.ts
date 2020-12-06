import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInteractionSocialpostPopoverComponent } from './user-interaction-socialpost-popover.component';

describe('UserInteractionSocialpostPopoverComponent', () => {
  let component: UserInteractionSocialpostPopoverComponent;
  let fixture: ComponentFixture<UserInteractionSocialpostPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserInteractionSocialpostPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInteractionSocialpostPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
