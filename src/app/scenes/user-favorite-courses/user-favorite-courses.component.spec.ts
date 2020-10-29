import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavoriteCoursesComponent } from './user-favorite-courses.component';

describe('UserFavoriteCoursesComponent', () => {
  let component: UserFavoriteCoursesComponent;
  let fixture: ComponentFixture<UserFavoriteCoursesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserFavoriteCoursesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFavoriteCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
