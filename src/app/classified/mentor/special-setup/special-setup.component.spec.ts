import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialSetupComponent } from './special-setup.component';

describe('SpecialSetupComponent', () => {
  let component: SpecialSetupComponent;
  let fixture: ComponentFixture<SpecialSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
