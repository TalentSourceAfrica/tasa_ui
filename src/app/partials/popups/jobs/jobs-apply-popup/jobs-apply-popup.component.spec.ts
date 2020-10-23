import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsApplyPopupComponent } from './jobs-apply-popup.component';

describe('JobsApplyPopupComponent', () => {
  let component: JobsApplyPopupComponent;
  let fixture: ComponentFixture<JobsApplyPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsApplyPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsApplyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
