import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjSendComponent } from './aj-send.component';

describe('AjSendComponent', () => {
  let component: AjSendComponent;
  let fixture: ComponentFixture<AjSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjSendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
