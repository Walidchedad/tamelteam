import { TestBed } from '@angular/core/testing';

import { PullService } from './pull.service';

describe('PullService', () => {
  let service: PullService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PullService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
