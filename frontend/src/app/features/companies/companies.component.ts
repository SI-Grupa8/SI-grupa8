import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompanyRequest } from '../../core/models/company-request';
import { CompanyService } from '../../core/services/http/company.service';
import { AddNewCompanyComponent } from './add-new-company/add-new-company.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent {
  modalVisible: boolean = false;
  companies: any[] = [];
  companyRequest: CompanyRequest = { 
    adminId:0
  };

  constructor(public dialog: MatDialog ,    private companyService: CompanyService ) { }

  ngOnInit(): void {
    this.getAll();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(AddNewCompanyComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  getAll(): void {
    this.companyService.getCompanies().subscribe(companies => {
      this.companies = companies;
    });
  }
}
