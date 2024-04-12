import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { CompanyService } from '../../../core/services/http/company.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

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
  companyId: number =0;
  @Output() companyDeleted = new EventEmitter<boolean>();

  durationInSeconds = 1;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private companyService: CompanyService, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private deletedMessage: MatSnackBar
    ) {
      this.companyId=data.companyId;
    }

    
  closeDialog(): void {
    this.dialog.closeAll();
    //this.dialogClosed.emit();
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
  deleteCompany() {
    this.companyService.deleteCompany(this.companyId).subscribe(response => {
      this.companyDeleted.emit();
  
    })
    this.openDeletedMessage();
    this.closeDialog();
  }
  openDeletedMessage() {
    this.deletedMessage.open('Company deleted!', 'Close', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
