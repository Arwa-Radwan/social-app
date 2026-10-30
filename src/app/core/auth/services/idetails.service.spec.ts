import { TestBed } from '@angular/core/testing';

import { IdetailsService } from './idetails.service';

describe('IdetailsService', () => {
  let service: IdetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
