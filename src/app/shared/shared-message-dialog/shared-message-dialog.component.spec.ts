import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedMessageDialogComponent } from './shared-message-dialog.component';

describe('SharedMessageDialogComponent', () => {
  let component: SharedMessageDialogComponent;
  let fixture: ComponentFixture<SharedMessageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedMessageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
