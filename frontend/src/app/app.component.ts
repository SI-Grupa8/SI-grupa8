import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from "./features/dashboard/dashboard.component";
import { SidebarComponent } from "./core/layout/sidebar/sidebar.component";
import { HeaderComponent } from "./core/layout/header/header.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [SidebarComponent, RouterOutlet, DashboardComponent, HeaderComponent, LoginComponent,ReactiveFormsModule]
})
export class AppComponent {
  title = 'frontend';
}
