import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common'; 
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { UserRequest } from '../../core/models/user-request';
import { UserService } from '../../core/services/http/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, FormsModule, RouterModule, NgFor ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})


export class UsersComponent {
  modalVisible: boolean = false;
  users: any[] = [];

  userRequest: UserRequest = {
    adminId: 0
  }

  constructor(public dialog: MatDialog, private userService: UserService) {}

  ngOnInit(): void {
    this.getAll();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddNewUserComponent, {
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  edit(user:any): void{
    const userId = user.id;
    this.userService.updateUser(this.userRequest, userId).subscribe(() => {
      console.log("User updated successfully!");
      this.getAll();
    });
  }
  delete(user:any): void {
    const userId = user.id;
    this.userService.deleteUser(this.userRequest.adminId, userId).subscribe(() => {
      console.log('User deleted successfully');
      this.getAll();
    });

  }

  getAll(): void {
    this.userService.getUsers(this.userRequest.adminId).subscribe(users => {
      this.users = users;
    });
  }
}
