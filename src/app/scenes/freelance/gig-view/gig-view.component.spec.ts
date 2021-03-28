import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GigViewComponent } from './gig-view.component';

describe('GigViewComponent', () => {
  let component: GigViewComponent;
  let fixture: ComponentFixture<GigViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GigViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GigViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
