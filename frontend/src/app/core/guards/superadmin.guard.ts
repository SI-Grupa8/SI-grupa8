import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/http/auth.service';
import { inject, Injectable } from '@angular/core';

export const superadminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if(inject(AuthService).isSuperAdmin()){
    console.log("is super admin");
    return true;
  }
    router.navigate(['/']);
    console.log("is not super admin");
    return false;
};
