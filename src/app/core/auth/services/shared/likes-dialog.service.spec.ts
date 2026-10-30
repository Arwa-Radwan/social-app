import { TestBed } from '@angular/core/testing';

import { LikesDialogService } from './likes-dialog.service';

describe('LikesDialogService', () => {
  let service: LikesDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LikesDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
