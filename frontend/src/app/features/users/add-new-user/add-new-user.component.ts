import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserRequest } from '../../../core/models/user-request';
import { UserService } from '../../../core/services/http/user.service';

@Component({
  selector: 'app-add-new-user',
  standalone: true,
  imports: [],
  templateUrl: './add-new-user.component.html',
  styleUrl: './add-new-user.component.scss'
})
export class AddNewUserComponent {
  userRequest: UserRequest = {
  };

  constructor(public dialogRef: MatDialogRef<AddNewUserComponent>, private userService: UserService) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
  add() {
    this.userService.addUser(this.userRequest).subscribe(() => {
      console.log('User added successfully');
    });
  }
}
