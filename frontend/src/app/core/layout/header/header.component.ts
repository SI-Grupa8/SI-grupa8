import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isProfileClicked = false;
  

  constructor(private router: Router) {}

  toggleProfileMenu(): void {    
    this.isProfileClicked = !this.isProfileClicked;
  }
}