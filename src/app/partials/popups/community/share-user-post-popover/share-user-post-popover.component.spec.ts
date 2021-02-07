import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareUserPostPopoverComponent } from './share-user-post-popover.component';

describe('ShareUserPostPopoverComponent', () => {
  let component: ShareUserPostPopoverComponent;
  let fixture: ComponentFixture<ShareUserPostPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShareUserPostPopoverComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareUserPostPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
