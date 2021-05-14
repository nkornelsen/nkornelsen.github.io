import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BezierUvsComponent } from './bezier-uvs.component';

describe('BezierUvsComponent', () => {
  let component: BezierUvsComponent;
  let fixture: ComponentFixture<BezierUvsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BezierUvsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BezierUvsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
