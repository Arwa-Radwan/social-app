import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgRegisterComponent } from './img-register.component';

describe('ImgRegisterComponent', () => {
  let component: ImgRegisterComponent;
  let fixture: ComponentFixture<ImgRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImgRegisterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImgRegisterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
