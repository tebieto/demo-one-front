import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedBottomSheetComponent } from './shared-bottom-sheet.component';

describe('SharedBottomSheetComponent', () => {
  let component: SharedBottomSheetComponent;
  let fixture: ComponentFixture<SharedBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
