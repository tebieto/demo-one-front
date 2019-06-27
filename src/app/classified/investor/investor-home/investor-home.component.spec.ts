import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorHomeComponent } from './investor-home.component';

describe('InvestorHomeComponent', () => {
  let component: InvestorHomeComponent;
  let fixture: ComponentFixture<InvestorHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
