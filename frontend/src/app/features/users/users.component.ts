import { Component, EventEmitter, Output } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common'; 
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddNewUserComponent } from './add-new-user/add-new-user.component';
import { UserRequest } from '../../core/models/user-request';
import { UserService } from '../../core/services/http/user.service';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AuthService } from '../../core/services/http/auth.service';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ActivatedRoute } from '@angular/router';

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
  searchQuery: string = ''; 
  companyId : number = 0;

  userRequest: UserRequest = {
  }

  constructor(public dialog: MatDialog, private userService: UserService, private authService : AuthService,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((res : any) => {
      console.log("adadadadadadada" + res.companyID);
      //if user is super admin
      if(res.companyID == null || res.companyID == undefined || res.companyID == 0)  {
        /*
        this.route.params.subscribe(params => {

          const companyId = params['id'];
          this.companyId = companyId;
          this.getAll(companyId);
        })*/
        //console.log("adadadadadadada" + this.companyId);
        const idParam = this.route.snapshot.paramMap.get('id');
        //console.log("adadadadadadada" + idParam);
        if (idParam != null) {
          this.companyId = +idParam;
          //console.log("adadadadadadada" + this.companyId);
          this.getAll(this.companyId);
        }
      }
      else {
        this.companyId = res.companyID;
        this.getAll(res.companyID);
      }
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddNewUserComponent, {
      disableClose: true ,
      scrollStrategy: new NoopScrollStrategy()
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    dialogRef.componentInstance.userAdded.subscribe(() => {
      this.getAll(this.companyId); // Refresh table after user is added
    });

  }

  editDialog(user: UserRequest): void {
    const dialogRef = this.dialog.open(EditUserComponent, {
      disableClose: true ,
      data: { user: user },
      scrollStrategy: new NoopScrollStrategy()
    });
    console.log(user)
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    dialogRef.componentInstance.userEdited.subscribe(() => {
      this.getAll(this.companyId); // Refresh table after user is added
    });

  }
  delete(user:any, event: Event): void {
    console.log(user)
    const userId = user.userID;
    event.preventDefault();

    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
  
    if (confirmDelete) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.userDeleted.emit();
        console.log('User deleted successfully');
        this.getAll(this.companyId);
      });
    }

  }

  
  filterUsers(): void {
    this.userService.getCompanyUsers(this.companyId).subscribe(users => {
      this.users = users.filter(user => 
        user.name.toLowerCase().startsWith(this.searchQuery.toLowerCase()) ||
        user.surname.toLowerCase().startsWith(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().startsWith(this.searchQuery.toLowerCase()) ||
        user.phoneNumber.toLowerCase().startsWith(this.searchQuery.toLowerCase())
      );
    });
  }
  
    getAll(companyId : number): void {
      this.userService.getCompanyUsers(companyId).subscribe(users => {
        this.users = users;
        this.filterUsers();
      });
    }
  
  }
