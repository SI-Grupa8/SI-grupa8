import { Component, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CompanyRequest } from '../../core/models/company-request';
import { CompanyService } from '../../core/services/http/company.service';
import { AddNewCompanyComponent } from './add-new-company/add-new-company.component';
import { CommonModule } from '@angular/common';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddNewAdminComponent } from './add-new-admin/add-new-admin.component';
import { EditCompanyComponent } from './edit-company/edit-company.component';
import { UserService } from '../../core/services/http/user.service';
import { CompanyCardComponent } from "./company-card/company-card.component";
import { RouterModule } from '@angular/router';
import { CompanyResponse } from '../../core/models/company-response';


@Component({
    selector: 'app-companies',
    standalone: true,
    templateUrl: './companies.component.html',
    styleUrl: './companies.component.scss',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, CompanyCardComponent, RouterModule]
})
export class CompaniesComponent {

  
  
  //@ViewChild('child', { static: true }) childComponent: CompanyCardComponent;
  
  modalVisible: boolean = false;
  companies: CompanyResponse[] = [];
  companyRequest: CompanyRequest = { 
  };
  searchQuery: string = ''; 
  users: any[] = [];
  constructor(public dialog: MatDialog, private companyService: CompanyService, private userService: UserService ) { }

  ngOnInit(): void {
    this.getAll();
    this.getAllAdminsWithoutCompany();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(AddNewCompanyComponent, {
      scrollStrategy: new NoopScrollStrategy(),
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
      scrollStrategy: new NoopScrollStrategy(),
      data: {
        companies: this.companies
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  
    dialogRef.componentInstance.userAdded.subscribe(() => {
      this.getAll(); 
    });
  }
  getAllAdminsWithoutCompany() : void{
    this.userService.getAllAdminsWithoutCompany().subscribe(users => {
      this.users= users;
      console.log("hhh"+this.users);
    })
  }
  openDialogEdit(company: any):void{
    const dialogRef = this.dialog.open(EditCompanyComponent, {
      disableClose: true ,
      data: {
        users: this.users,
        companyID: company.companyID,
        scrollStrategy: new NoopScrollStrategy()
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    dialogRef.componentInstance.companyEdited.subscribe(() => {
      this.getAll(); 
    });

  }
  getAll(): void {
    this.companyService.getCompanies().subscribe(companies => {
      this.companies = companies;
      console.log(this.companies);
      this.filterCompanies();
    });
  }

  

}