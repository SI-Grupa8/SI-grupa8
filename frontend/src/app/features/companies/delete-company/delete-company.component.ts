import { Component, EventEmitter, Output } from '@angular/core';
import { CompanyService } from '../../../core/services/http/company.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-company',
  standalone: true,
  imports: [],
  templateUrl: './delete-company.component.html',
  styleUrl: './delete-company.component.scss'
})
export class DeleteCompanyComponent {
  //twoFaEnabled: boolean = true;
  //twoFaRequest: TwoFaRequest = {}//, item.getStorage na false

  @Output() dialogClosed = new EventEmitter<boolean>();

  constructor(
    private companyService: CompanyService, private dialog: MatDialog
    ) {
    }

  closeDialog(): void {
    this.dialog.closeAll();
    //this.dialogClosed.emit(this.twoFaEnabled);
  }
  /*
  deleteCompany() {
    this.companyService.deleteCompany().subscribe((response)=> {
      console.log(response);
    })
    localStorage.setItem('2fa', 'false');
    this.twoFaEnabled = false;
    this.closeDialog();
  }*/
  nothing() {
    //localStorage.setItem('2fa', 'true');
    this.closeDialog();
  }
}
