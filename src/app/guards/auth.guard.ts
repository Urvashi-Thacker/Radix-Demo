import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../Services/Account/account.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  let accountService = inject(AccountService);
  let router = inject(Router);
  if (!accountService.isLoggedIn()) {
    router.navigate(['sign-in']);
    return false;
  }
  return true;
};
