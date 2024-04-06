import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/http/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  userRole: string | undefined;
  constructor(public authService: AuthService) {}

  ngOnInit() {
    // Retrieve user role from AuthService
    this.userRole = this.authService.getUserRole();
  }

  logout() {
    this.authService.logout();
  }
}
