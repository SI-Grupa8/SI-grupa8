import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAdminComponent } from './add-new-admin.component';

describe('AddNewAdminComponent', () => {
  let component: AddNewAdminComponent;
  let fixture: ComponentFixture<AddNewAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNewAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
