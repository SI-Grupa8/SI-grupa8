import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from "./features/dashboard/dashboard.component";
import { SidebarComponent } from "./core/layout/sidebar/sidebar.component";
import { HeaderComponent } from "./core/layout/header/header.component";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [SidebarComponent, RouterOutlet, DashboardComponent, HeaderComponent, LoginComponent,ReactiveFormsModule,CommonModule]
})
export class AppComponent {
  title = 'frontend';

  showHeaderAndSidebar: boolean = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.showHeaderAndSidebar = this.activatedRoute?.firstChild?.snapshot.data['showHeaderAndSidebar'] !== false;
    });
  }
}
