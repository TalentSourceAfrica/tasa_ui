import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsPopupComponent } from './user-details-popup.component';

describe('UserDetailsPopupComponent', () => {
  let component: UserDetailsPopupComponent;
  let fixture: ComponentFixture<UserDetailsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserDetailsPopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
