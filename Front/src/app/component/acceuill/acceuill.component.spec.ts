import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceuillComponent } from './acceuill.component';

describe('AcceuillComponent', () => {
  let component: AcceuillComponent;
  let fixture: ComponentFixture<AcceuillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceuillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceuillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
