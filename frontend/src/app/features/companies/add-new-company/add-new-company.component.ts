import { Component, EventEmitter, Output } from '@angular/core';
import { CompanyRequest } from '../../../core/models/company-request';
import { MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../../core/services/http/company.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl,Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CodeInputModule } from 'angular-code-input';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-add-new-company',
  standalone: true,
  imports: [FormsModule,NgIf, ReactiveFormsModule, CodeInputModule],
  templateUrl: './add-new-company.component.html',
  styleUrl: './add-new-company.component.scss'
})
export class AddNewCompanyComponent {
  @Output() companyAdded: EventEmitter<any> = new EventEmitter<any>();
 
  addCompanyForm: FormGroup;
  companyRequest: CompanyRequest = {
  };

  constructor(public f: FormBuilder,public dialogRef: MatDialogRef<AddNewCompanyComponent>, private companyService: CompanyService) {
    this.addCompanyForm = this.f.group({
      companyName: [''],
      adminID: ['']
    });
    
  }


  closeDialog(): void {
    this.dialogRef.close();
  }
  add(event: Event){
    this.companyRequest.companyName = this.addCompanyForm.get('companyName')?.value;
    this.companyRequest.adminID = this.addCompanyForm.get('adminID')?.value;
  
    event.preventDefault();
  
    this.companyService.createCompany(this.companyRequest).subscribe(()=>{
      this.companyAdded.emit();
      console.log('Company added successfully');
      this.closeDialog();
    });
  }

}
