import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSignupPopupComponent } from './new-signup-popup.component';

describe('NewSignupPopupComponent', () => {
  let component: NewSignupPopupComponent;
  let fixture: ComponentFixture<NewSignupPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSignupPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSignupPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
