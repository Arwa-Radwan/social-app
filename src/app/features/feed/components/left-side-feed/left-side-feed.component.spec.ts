import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftSideFeedComponent } from './left-side-feed.component';

describe('LeftSideFeedComponent', () => {
  let component: LeftSideFeedComponent;
  let fixture: ComponentFixture<LeftSideFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftSideFeedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeftSideFeedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
