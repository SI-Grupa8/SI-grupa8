import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyComponent } from './edit-company.component';

describe('EditCompanyComponent', () => {
  let component: EditCompanyComponent;
  let fixture: ComponentFixture<EditCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCompanyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
