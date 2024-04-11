import { Component, EventEmitter, Input, OnInit, Output, input } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {MatPaginatorModule} from '@angular/material/paginator';
import { CompanyResponse } from '../../../core/models/company-response';
import { CompanyService } from '../../../core/services/http/company.service';
import { UserRequest } from '../../../core/models/user-request';
import { MatDialog } from '@angular/material/dialog';
import { AddNewAdminComponent } from '../add-new-admin/add-new-admin.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-itempage',
  standalone: true,
  imports: [MatTabsModule, RouterModule, MatPaginatorModule, CommonModule],
  templateUrl: './company-itempage.component.html',
  styleUrl: './company-itempage.component.scss'
})
export class CompanyItempageComponent implements OnInit {

  @Input() tabsArray: string[] = ['Overview', 'Members'];
  @Output() onTabChange = new EventEmitter<number>();
  activatedTab: number = 0;

  setTab(index:number) {
    this.activatedTab = index;
    this.onTabChange.emit(this.activatedTab);
  }
  
  id: number = 0;
  company: CompanyResponse = {}
  members: UserRequest[] | undefined = [] 
  constructor(private route: ActivatedRoute, private dialog: MatDialog, private companyService: CompanyService) { }
ngOnInit(): void {
  
  const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.id = +idParam;
  }
  console.log("id:" +this.id);
  this.getCompany();
  this.getCompanyUsers();
  console.log("Company: " + this.company);
  console.log("Members:" + this.members);
  
}
  getCompany(): void {
    this.companyService.getCompanyById(this.id).subscribe(company => {
      console.log(company);
      this.company = company;
      this.members = company.users;
      console.log(this.members);
      //this.filterCompanies();
    });
  }
  getCompanyUsers(): void {
    this.companyService.getCompanyUsers(this.id).subscribe(response => {
      //console.log(company);
      //this.company = company;
      this.members = response;
      //console.log(this.members);
      //this.filterCompanies();
    });
  }
  openDialogAdmin(): void {
    const dialogRef = this.dialog.open(AddNewAdminComponent, {
      data: {companyId: this.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    dialogRef.componentInstance.userAdded.subscribe(Response => {
      this.getCompanyUsers();
      console.log("Spojen emmiter!");
    })
    /*
    dialogRef.componentInstance.userAdded.subscribe(() => {
      this.getAll(); 
    });*/
  }

}
