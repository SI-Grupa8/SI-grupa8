import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
    {path: '', component: DashboardComponent},
    {path:'login',component:LoginComponent, data: {showHeaderAndSidebar: false}},
    {path:'profile',  component:ProfileComponent}
];
