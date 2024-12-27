import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcAfterComponent } from './ac-after.component';

describe('AcAfterComponent', () => {
  let component: AcAfterComponent;
  let fixture: ComponentFixture<AcAfterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcAfterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcAfterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
