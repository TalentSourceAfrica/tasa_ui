import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRequirementComponent } from './all-requirement.component';

describe('AllRequirementComponent', () => {
  let component: AllRequirementComponent;
  let fixture: ComponentFixture<AllRequirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllRequirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
