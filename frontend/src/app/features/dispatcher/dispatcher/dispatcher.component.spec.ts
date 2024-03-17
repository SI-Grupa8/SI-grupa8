import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatcherComponent } from './dispatcher.component';

describe('DispatcherComponent', () => {
  let component: DispatcherComponent;
  let fixture: ComponentFixture<DispatcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatcherComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DispatcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
