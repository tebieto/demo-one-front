import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedAvatarComponent } from './shared-avatar.component';

describe('SharedAvatarComponent', () => {
  let component: SharedAvatarComponent;
  let fixture: ComponentFixture<SharedAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
