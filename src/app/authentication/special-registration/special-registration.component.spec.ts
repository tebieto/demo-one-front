import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialRegistrationComponent } from './special-registration.component';

describe('SpecialRegistrationComponent', () => {
  let component: SpecialRegistrationComponent;
  let fixture: ComponentFixture<SpecialRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
