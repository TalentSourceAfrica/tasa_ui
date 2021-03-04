import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareArticlePopupComponent } from './share-article-popup.component';

describe('ShareArticlePopupComponent', () => {
  let component: ShareArticlePopupComponent;
  let fixture: ComponentFixture<ShareArticlePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareArticlePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareArticlePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
