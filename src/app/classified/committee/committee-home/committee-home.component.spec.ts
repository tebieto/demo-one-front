import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeHomeComponent } from './committee-home.component';

describe('CommitteeHomeComponent', () => {
  let component: CommitteeHomeComponent;
  let fixture: ComponentFixture<CommitteeHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitteeHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
