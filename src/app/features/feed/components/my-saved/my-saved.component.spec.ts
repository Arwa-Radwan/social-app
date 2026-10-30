import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySavedComponent } from './my-saved.component';

describe('MySavedComponent', () => {
  let component: MySavedComponent;
  let fixture: ComponentFixture<MySavedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySavedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MySavedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
