import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenteeDashComponent } from './mentee-dash.component';

describe('MenteeDashComponent', () => {
  let component: MenteeDashComponent;
  let fixture: ComponentFixture<MenteeDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenteeDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenteeDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
