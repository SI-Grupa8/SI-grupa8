
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl,Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CodeInputModule } from 'angular-code-input';
import { CommonModule, NgIf } from '@angular/common';
import { CompanyRequest } from '../../../core/models/company-request';
import { CompanyService } from '../../../core/services/http/company.service';
import { UserService } from '../../../core/services/http/user.service';
import { UserRequest } from '../../../core/models/user-request';


@Component({
  selector: 'app-edit-company',
  standalone: true,
  imports: [FormsModule,NgIf, ReactiveFormsModule, CodeInputModule, CommonModule],
  templateUrl: './edit-company.component.html',
  styleUrl: './edit-company.component.scss'
})
export class EditCompanyComponent {

  @Output() companyEdited: EventEmitter<any> = new EventEmitter<any>();
  editCompanyForm: FormGroup;
  companyRequest: CompanyRequest = {
  };  
  users : any[] = [];
  cID: number=0;
  constructor(public f: FormBuilder,public dialogRef: MatDialogRef<EditCompanyComponent>,private userService:UserService, private companyService: CompanyService,
     @Inject(MAT_DIALOG_DATA) public data: any) {
    this.editCompanyForm = this.f.group({
      admin: ['']
    });
   this.users=data.users;
 this.cID=data.companyID;
   console.log(this.cID);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

 
  edit(event: Event) {
    this.companyRequest.companyID=this.cID;
    const user: UserRequest = {
      userID: this.editCompanyForm.get('admin')?.value, 
    };
  
    this.companyRequest.users = [user];
    event.preventDefault();
    this.companyService.editCompany(this.companyRequest).subscribe(() => {
      this.companyEdited.emit();
      console.log('Company edited successfully');
      this.closeDialog();
    });
  }
}