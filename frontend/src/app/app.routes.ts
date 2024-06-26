import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';
import { RegisterComponent } from './features/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import { DevicesComponent } from './features/devices/devices.component';
import { UsersComponent } from './features/users/users.component';
import { CompaniesComponent } from './features/companies/companies.component';
import { superadminGuard } from './core/guards/superadmin.guard';
import { MapComponent } from './features/map/map.component';
import { CompanyItempageComponent } from './features/companies/company-itempage/company-itempage.component';
import { adminGuard } from './core/guards/admin.guard';


export const routes: Routes = [
    //need to add auth guard later on
    {path: '', component: HomeComponent, canActivate: [authGuard, adminGuard ]},
    {path: 'login',component: LoginComponent, data: {showHeaderAndSidebar: false}},
    {path: 'register', component: RegisterComponent, data: {showHeaderAndSidebar: false}},
    {path: 'profile',  component: ProfileComponent, canActivate: [authGuard]},
    {path: 'devices', component: DevicesComponent, canActivate: [authGuard]},
    {path: 'users', component: UsersComponent, canActivate: [authGuard]},
    {path: 'map', component: MapComponent, canActivate: [authGuard]},
    {path: 'companies', canActivate: [authGuard, superadminGuard], children: [
        {path: '', component: CompaniesComponent},
        {path: ':id', component: CompanyItempageComponent}
    ]}
];
