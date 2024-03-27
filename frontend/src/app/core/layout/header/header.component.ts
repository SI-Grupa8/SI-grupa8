import { Component, HostListener } from '@angular/core';
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