import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightSideFeedComponent } from './right-side-feed.component';

describe('RightSideFeedComponent', () => {
  let component: RightSideFeedComponent;
  let fixture: ComponentFixture<RightSideFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightSideFeedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RightSideFeedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
