import { TestBed } from '@angular/core/testing';

import { SocialnetworkService } from './socialnetwork.service';

describe('SocialnetworkService', () => {
  let service: SocialnetworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialnetworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
