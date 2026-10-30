import { TestBed } from '@angular/core/testing';

import { SuggestedService } from './suggested.service';

describe('SuggestedService', () => {
  let service: SuggestedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuggestedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
