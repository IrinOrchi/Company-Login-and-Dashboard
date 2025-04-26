import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { LoginService } from "../services/login.service";
import { map } from "rxjs";

export const redirectLegacyGuard: CanActivateFn = (route, state) => {
  const urlParams = new URLSearchParams(window.location.search);
  const loginService = inject(LoginService);
  const router = inject(Router);
  const jobNo: string | null = urlParams.get('jobNo');
  const frmFair: string | null = urlParams.get('frmFair');

  loginService.isRedirectingToLegacySite.next(true);

  const queryString = window.location.href.slice(
    window.location.href.indexOf("?")
  );

  return loginService.getUserLoginData().pipe(
    map((loggedInUserData: any) => {
      if (loggedInUserData && !loggedInUserData.notLoggedIn) {
        console.log('frmFair:', frmFair);
        console.log('jobNo:', jobNo);

        if (frmFair === '1' && jobNo) {
          const fairRedirectURL = `https://corporate3.bdjobs.com/Applicant_Process.asp?jobno=${jobNo}&pgtype=al&st=0&frmFair=1&jview=1`;
          console.log('Redirecting to:', fairRedirectURL);
          window.location.replace(fairRedirectURL);
          return false; // Exit the function to prevent further execution
        }
  

        router.navigate(["dashboard"]);
        return false;
      }

      loginService.isRedirectingToLegacySite.next(false);
      return true;
    })
  );
};
