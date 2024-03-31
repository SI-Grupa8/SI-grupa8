import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-user',
  standalone: true,
  imports: [],
  templateUrl: './add-new-user.component.html',
  styleUrl: './add-new-user.component.scss'
})
export class AddNewUserComponent {
  constructor(public dialogRef: MatDialogRef<AddNewUserComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
  addNewUser(): void {
    
  }

}
