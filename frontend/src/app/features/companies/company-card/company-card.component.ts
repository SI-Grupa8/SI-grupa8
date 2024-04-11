import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddNewAdminComponent } from '../add-new-admin/add-new-admin.component';
import { CompanyResponse } from '../../../core/models/company-response';
import { DeleteCompanyComponent } from '../delete-company/delete-company.component';


@Component({
  selector: 'app-company-card',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule,MatIconModule],
  templateUrl: './company-card.component.html',
  styleUrl: './company-card.component.scss'
})
export class CompanyCardComponent implements OnInit {

  @Output() deletedCompany: EventEmitter<any> = new EventEmitter<any>();

  
  @Input() company: CompanyResponse = {};
  companyId: number | undefined = 1;

  ngOnInit(): void {
    
    this.companyId = this.company?.companyID;
    //console.log(this.companyId)
  }

  openOptions(event: MouseEvent) {
    // Prevent click event from bubbling up to parent elements
    event.stopPropagation();
  }
  constructor(public dialog: MatDialog,
  ){
    //console.log(this.company.companyName);
    //this.companyId = this.company.companyID;
  }

  openDialogAdmin(): void {
    const dialogRef = this.dialog.open(AddNewAdminComponent, {
      data: {companyId: this.companyId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    /*
    dialogRef.componentInstance.userAdded.subscribe(() => {
      this.getAll(); 
    });*/
  }
  openDialogDelete(): void {
    const dialogRef = this.dialog.open(DeleteCompanyComponent, {
      data: {companyId: this.companyId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.deletedCompany.emit();
    });
    dialogRef.componentInstance.companyDeleted.subscribe(() => {
      this.deletedCompany.emit();
      //this.getAll(); // Refresh table after user is added
    });
    /*
    dialogRef.componentInstance.userAdded.subscribe(() => {
      this.getAll(); 
    });*/
  }
  
}
