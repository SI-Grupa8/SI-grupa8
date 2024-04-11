import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyItempageComponent } from './company-itempage.component';

describe('CompanyItempageComponent', () => {
  let component: CompanyItempageComponent;
  let fixture: ComponentFixture<CompanyItempageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyItempageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanyItempageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
