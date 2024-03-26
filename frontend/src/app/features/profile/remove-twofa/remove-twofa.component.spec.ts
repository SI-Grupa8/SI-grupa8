import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveTwofaComponent } from './remove-twofa.component';

describe('RemoveTwofaComponent', () => {
  let component: RemoveTwofaComponent;
  let fixture: ComponentFixture<RemoveTwofaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveTwofaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemoveTwofaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
