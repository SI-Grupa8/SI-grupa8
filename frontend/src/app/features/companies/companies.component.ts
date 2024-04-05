import { Component, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompanyRequest } from '../../core/models/company-request';
import { CompanyService } from '../../core/services/http/company.service';
import { AddNewCompanyComponent } from './add-new-company/add-new-company.component';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddNewAdminComponent } from './add-new-admin/add-new-admin.component';


@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], 
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent {
  modalVisible: boolean = false;
  companies: any[] = [];
  companyRequest: CompanyRequest = { 
  };
  searchQuery: string = ''; 

  constructor(public dialog: MatDialog, private companyService: CompanyService ) { }

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
    dialogRef.componentInstance.companyAdded.subscribe(() => {
      this.getAll(); // Refresh table after user is added
    });
    
  }

  filterCompanies(): void {
    this.companyService.getCompanies().subscribe(companies => {
      this.companies = companies.filter(company => 
        company.companyName.toLowerCase().startsWith(this.searchQuery.toLowerCase()) 
      );
    });
  }
  openDialogAdmin(): void {
    const dialogRef = this.dialog.open(AddNewAdminComponent, {
      disableClose: true,
      data: {
        companies: this.companies
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  
    dialogRef.componentInstance.userAdded.subscribe(() => {
      this.getAll(); // Refresh table after user is added
    });
  }

  getAll(): void {
    this.companyService.getCompanies().subscribe(companies => {
      this.companies = companies;
      this.filterCompanies();
    });
  }
}