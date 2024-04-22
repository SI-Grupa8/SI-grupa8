import { Component, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/http/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isProfileClicked = false;
  
 userData: any={};
  constructor(private router: Router,private userService:  UserService
    ) {}

  toggleProfileMenu(): void {    
    this.isProfileClicked = !this.isProfileClicked;
  }

  // assuming the roles are fixed with ids
  getRoleName(roleID: number): string {
    switch (roleID) {
      case 1:
        return 'Admin';
      case 2:
        return 'Super Admin';
      case 3:
        return 'Dispatcher';
      case 4:
        return 'Fleet Manager';
      case 5:
        return 'User';
      default:
        return 'Unknown Role';
    }
  }

  ngOnInit(): void{
    if(localStorage.getItem("token")){
      this.userService.getUser().subscribe(
        (data) => {
          this.userData = data;
          console.log(this.userData)
        },
    )};
  };
  // close profile menu if clicked anywhere else in the app
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Check if the click target is inside the profile menu or the profile container
    if (!target.closest('.profile-menu') && !target.closest('.profile-container')) {
      this.isProfileClicked = false;
    }
  }
}