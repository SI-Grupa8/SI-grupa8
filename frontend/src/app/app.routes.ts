import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProfileComponent } from './features/profile/profile.component';
import { RegisterComponent } from './features/register/register.component';

export const routes: Routes = [
    //need to add auth guard later on
    {path: '', component: DashboardComponent},
    {path:'login',component:LoginComponent, data: {showHeaderAndSidebar: false}},
    {path: 'register', component: RegisterComponent, data: {showHeaderAndSidebar: false}},
    {path:'profile',  component:ProfileComponent}
];
