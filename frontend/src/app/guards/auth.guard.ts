import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginRequiredGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};

export const forcePasswordChangeGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // if (!authService.isLoggedIn()) {
  //   router.navigate(['/login']);
  //   return false;
  // }
  
  if (authService.mustChangePassword()) {
    router.navigate(['/change-password']);
    return false;
  }
  
  return true;
};
