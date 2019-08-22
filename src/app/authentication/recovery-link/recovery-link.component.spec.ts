import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoveryLinkComponent } from './recovery-link.component';

describe('RecoveryLinkComponent', () => {
  let component: RecoveryLinkComponent;
  let fixture: ComponentFixture<RecoveryLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecoveryLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoveryLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
