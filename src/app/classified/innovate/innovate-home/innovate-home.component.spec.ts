import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnovateHomeComponent } from './innovate-home.component';

describe('InnovateHomeComponent', () => {
  let component: InnovateHomeComponent;
  let fixture: ComponentFixture<InnovateHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnovateHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnovateHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
