import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGigsComponent } from './all-gigs.component';

describe('AllGigsComponent', () => {
  let component: AllGigsComponent;
  let fixture: ComponentFixture<AllGigsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllGigsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllGigsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
