import { Component, EventEmitter, Output } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common'; 
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { UserRequest } from '../../core/models/user-request';
import { UserService } from '../../core/services/http/user.service';
import { EditUserComponent } from './edit-user/edit-user.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, FormsModule, RouterModule, NgFor, CommonModule ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})


export class UsersComponent {
  @Output() userDeleted: EventEmitter<any> = new EventEmitter<any>();
  modalVisible: boolean = false;
  users: any[] = [];
  adminId: number = 2;

  userRequest: UserRequest = {
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
    dialogRef.componentInstance.userAdded.subscribe(() => {
      this.getAll(); // Refresh table after user is added
    });

  }

  editDialog(user: any): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      disableClose: true ,
      data: { user: user }
    });
    console.log(user)
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    dialogRef.componentInstance.userEdited.subscribe(() => {
      this.getAll(); // Refresh table after user is added
    });

  }
  delete(user:any, event: Event): void {
    console.log(user)
    const userId = user.userID;
    event.preventDefault();
    this.userService.deleteUser(userId).subscribe(() => {
      this.userDeleted.emit();
      console.log('User deleted successfully');
      this.getAll();
    });

  }

  getAll(): void {
    this.userService.getCompanyUsers().subscribe(users => {
      this.users = users;
    });
  }
}
