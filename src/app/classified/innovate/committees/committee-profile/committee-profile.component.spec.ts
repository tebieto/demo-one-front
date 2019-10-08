import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeProfileComponent } from './committee-profile.component';

describe('CommitteeProfileComponent', () => {
  let component: CommitteeProfileComponent;
  let fixture: ComponentFixture<CommitteeProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitteeProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
