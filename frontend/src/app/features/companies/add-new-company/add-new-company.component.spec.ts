import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCompanyComponent } from './add-new-company.component';

describe('AddNewCompanyComponent', () => {
  let component: AddNewCompanyComponent;
  let fixture: ComponentFixture<AddNewCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewCompanyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
