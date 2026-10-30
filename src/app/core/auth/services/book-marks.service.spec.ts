import { TestBed } from '@angular/core/testing';

import { BookMarksService } from './book-marks.service';

describe('BookMarksService', () => {
  let service: BookMarksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookMarksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
