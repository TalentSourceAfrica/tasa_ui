import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialConnectionsComponent } from './social-connections.component';

describe('SocialConnectionsComponent', () => {
  let component: SocialConnectionsComponent;
  let fixture: ComponentFixture<SocialConnectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialConnectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
