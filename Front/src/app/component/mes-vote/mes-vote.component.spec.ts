import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesVoteComponent } from './mes-vote.component';

describe('MesVoteComponent', () => {
  let component: MesVoteComponent;
  let fixture: ComponentFixture<MesVoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesVoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
