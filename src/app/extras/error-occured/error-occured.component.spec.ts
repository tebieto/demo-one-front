import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorOccuredComponent } from './error-occured.component';

describe('ErrorOccuredComponent', () => {
  let component: ErrorOccuredComponent;
  let fixture: ComponentFixture<ErrorOccuredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorOccuredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorOccuredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
