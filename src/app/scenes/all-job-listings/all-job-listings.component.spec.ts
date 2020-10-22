import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllJobListingsComponent } from './all-job-listings.component';

describe('AllJobListingsComponent', () => {
  let component: AllJobListingsComponent;
  let fixture: ComponentFixture<AllJobListingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllJobListingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllJobListingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
