import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteUserPopupComponent } from './invite-user-popup.component';

describe('InviteUserPopupComponent', () => {
  let component: InviteUserPopupComponent;
  let fixture: ComponentFixture<InviteUserPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteUserPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteUserPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
