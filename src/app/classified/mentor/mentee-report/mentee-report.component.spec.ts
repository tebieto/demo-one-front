import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenteeReportComponent } from './mentee-report.component';

describe('MenteeReportComponent', () => {
  let component: MenteeReportComponent;
  let fixture: ComponentFixture<MenteeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenteeReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenteeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
