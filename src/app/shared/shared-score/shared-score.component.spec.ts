import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedScoreComponent } from './shared-score.component';

describe('SharedScoreComponent', () => {
  let component: SharedScoreComponent;
  let fixture: ComponentFixture<SharedScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
