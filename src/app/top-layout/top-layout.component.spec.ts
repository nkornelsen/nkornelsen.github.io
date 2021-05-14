import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopLayoutComponent } from './top-layout.component';

describe('TopLayoutComponent', () => {
  let component: TopLayoutComponent;
  let fixture: ComponentFixture<TopLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
