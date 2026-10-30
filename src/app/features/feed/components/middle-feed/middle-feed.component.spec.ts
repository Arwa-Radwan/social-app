import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiddleFeedComponent } from './middle-feed.component';

describe('MiddleFeedComponent', () => {
  let component: MiddleFeedComponent;
  let fixture: ComponentFixture<MiddleFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiddleFeedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MiddleFeedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
