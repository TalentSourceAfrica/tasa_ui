import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitFeedbackPopupComponent } from './submit-feedback-popup.component';

describe('SubmitFeedbackPopupComponent', () => {
  let component: SubmitFeedbackPopupComponent;
  let fixture: ComponentFixture<SubmitFeedbackPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitFeedbackPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitFeedbackPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
