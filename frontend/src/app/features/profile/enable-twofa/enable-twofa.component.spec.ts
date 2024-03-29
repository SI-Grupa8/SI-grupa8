import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableTwofaComponent } from './enable-twofa.component';

describe('EnableTwofaComponent', () => {
  let component: EnableTwofaComponent;
  let fixture: ComponentFixture<EnableTwofaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnableTwofaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnableTwofaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
