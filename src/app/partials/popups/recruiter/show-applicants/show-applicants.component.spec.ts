import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowApplicantsComponent } from './show-applicants.component';

describe('ShowApplicantsComponent', () => {
  let component: ShowApplicantsComponent;
  let fixture: ComponentFixture<ShowApplicantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowApplicantsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
