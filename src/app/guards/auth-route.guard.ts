import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { inject, isDevMode } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

export const authRouteGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  let isTokenExpired = false;
  // debugger;

  if (isDevMode()) {
    return true;
  }

  loginService.validToken().subscribe({
    next: (isExpired: boolean) => {
      // console.log('Is token valid?', isExpired);
      // You can use the isExpired variable here
      isTokenExpired = isExpired;
    },
    error: (err) => {
      console.error('Error checking token expiration:', err);
      // Handle the error case
    },
  });
  if (isTokenExpired) {
    loginService.getSupportingInfo().subscribe({
      next: (data) => {
        if (data) {
          loginService.setLegacyApiDataToLocalStorage(data);
        }
      },
    });
    return true;
  }
  return loginService.refreshByToken().pipe(
    map((data) => {
      if (
        data.status === 200 &&
        data.message === 'User logged in successfully.'
      ) {
        window.localStorage.clear();
        window.sessionStorage.clear();
        loginService.getSupportingInfo().subscribe({
          next: (data) => {
            // debugger;
            if (data) {
              loginService.setLegacyApiDataToLocalStorage(data);
            }
          },
        });
        return true;
      } else {
        return router.createUrlTree(['/']);
      }
    }),
    catchError(() => of(router.createUrlTree(['/'])))
  );
};
