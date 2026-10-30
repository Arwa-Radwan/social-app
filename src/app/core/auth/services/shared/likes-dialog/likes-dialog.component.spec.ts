import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikesDialogComponent } from './likes-dialog.component';

describe('LikesDialogComponent', () => {
  let component: LikesDialogComponent;
  let fixture: ComponentFixture<LikesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikesDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LikesDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
