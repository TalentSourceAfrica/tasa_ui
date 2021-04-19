import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRequirementViewComponent } from './order-requirement-view.component';

describe('OrderRequirementViewComponent', () => {
  let component: OrderRequirementViewComponent;
  let fixture: ComponentFixture<OrderRequirementViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRequirementViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRequirementViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
