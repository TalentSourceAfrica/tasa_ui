import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupViewPopupComponent } from './group-view-popup.component';

describe('GroupViewPopupComponent', () => {
  let component: GroupViewPopupComponent;
  let fixture: ComponentFixture<GroupViewPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupViewPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupViewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
