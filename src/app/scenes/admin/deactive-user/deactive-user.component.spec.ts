import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactiveUserComponent } from './deactive-user.component';

describe('DeactiveUserComponent', () => {
  let component: DeactiveUserComponent;
  let fixture: ComponentFixture<DeactiveUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeactiveUserComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactiveUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
