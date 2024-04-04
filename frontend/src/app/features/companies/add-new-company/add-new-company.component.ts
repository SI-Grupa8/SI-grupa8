import { Component } from '@angular/core';
import { CompanyRequest } from '../../../core/models/company-request';
import { MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../../core/services/http/company.service';

@Component({
  selector: 'app-add-new-company',
  standalone: true,
  imports: [],
  templateUrl: './add-new-company.component.html',
  styleUrl: './add-new-company.component.scss'
})
export class AddNewCompanyComponent {
  companyRequest: CompanyRequest = {
  };

  constructor(public dialogRef: MatDialogRef<AddNewCompanyComponent>, private companyService: CompanyService) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
  add(){
    this.companyService.createCompany(this.companyRequest).subscribe(()=>{
      console.log('Device added successfully');
    });
  }

}
