import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';
import { RegisterComponent } from './features/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { DevicesComponent } from './features/devices/devices.component';
import { UsersComponent } from './features/users/users.component';

export const routes: Routes = [
    //need to add auth guard later on
    {path: '', component: HomeComponent, canActivate: [authGuard]},
    {path: 'login',component: LoginComponent, data: {showHeaderAndSidebar: false}},
    {path: 'register', component: RegisterComponent, data: {showHeaderAndSidebar: false}},
    {path: 'profile',  component: ProfileComponent, canActivate: [authGuard]},
    {path: 'devices', component: DevicesComponent, canActivate: [authGuard]},
    {path: 'users', component: UsersComponent, canActivate: [authGuard]}
];
