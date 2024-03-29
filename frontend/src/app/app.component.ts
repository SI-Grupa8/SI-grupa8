import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from "./features/dashboard/dashboard.component";
import { SidebarComponent } from "./core/layout/sidebar/sidebar.component";
import { HeaderComponent } from "./core/layout/header/header.component";
import { Subscription, filter, interval } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/http/auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [SidebarComponent, RouterOutlet, DashboardComponent, HeaderComponent, LoginComponent,ReactiveFormsModule,CommonModule]
})
export class AppComponent implements OnDestroy {
  title = 'frontend';

  showHeaderAndSidebar: boolean = true;
   private subscription: Subscription;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService) {
    this.subscription = interval(500000).subscribe(() => {
      if (!this.authService.isCookiePresent('refresh')) {
        // If the cookie is missing, log out the user
        this.authService.logout();
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.showHeaderAndSidebar = this.activatedRoute?.firstChild?.snapshot.data['showHeaderAndSidebar'] !== false;
    });
  }
  
  
  ngOnDestroy(): void {
    // Unsubscribe from the interval observable to avoid memory leaks
    this.subscription.unsubscribe();
  }
}

