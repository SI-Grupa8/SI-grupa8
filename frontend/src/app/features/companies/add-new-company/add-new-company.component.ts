import { Component, EventEmitter, Output } from '@angular/core';
import { CompanyRequest } from '../../../core/models/company-request';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CompanyService } from '../../../core/services/http/company.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl,Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CodeInputModule } from 'angular-code-input';
import { NgIf } from '@angular/common';
import { UserRequest } from '../../../core/models/user-request';
import { UserService } from '../../../core/services/http/user.service';
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
  userRequest: UserRequest={};

  constructor(public dialog: MatDialog, public f: FormBuilder,public dialogRef: MatDialogRef<AddNewCompanyComponent>, private companyService: CompanyService, private userService: UserService) {
    this.addCompanyForm = this.f.group({
      companyName: [''],
    
    });
    
  }


  closeDialog(): void {
    this.dialogRef.close();
  }
  add(event: Event){
    this.companyRequest.companyName = this.addCompanyForm.get('companyName')?.value;

    event.preventDefault();
  
    this.companyService.createCompany(this.companyRequest).subscribe(()=>{
      this.companyAdded.emit();
      console.log('Company added successfully');
      this.closeDialog();
    });
  }
  openDialogAdmin(): void {
    const dialogRef = this.dialog.open(AddNewCompanyComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  
 
  }

}
