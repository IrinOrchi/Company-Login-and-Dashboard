import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private Domain = window.location.href.includes('gateway')
    ? 'gateway'
    : 'recruiter';
  private readonly CompanySizeUpdateApiUrl =
    'https://corporate3.bdjobs.com/Corporate_Company_Size_Update.asp';
    private readonly MultipleJobsGetApiUrl = "https://api.bdjobs.com/EmployerApi/api/MISJobPosting/GetDraftedJobListInfo";
  constructor(private httpClient: HttpClient) {}

  getMultipleJobs(): Observable<any> {
    const companyId = window.localStorage.getItem('CompanyId');
    try {
      return this.httpClient
        .get(
          `${this.MultipleJobsGetApiUrl}?&CompanyId=${companyId}`,
          {
            withCredentials: true,
          }
        )
        .pipe(
          catchError(() => {
            return of({ notUpdated: true });
          })
        );
    } catch {
      return of({ notUpdated: true });
    }
  }
  updateCompanySize(minValue: number, maxValue: number): Observable<any> {
    const companyId = window.localStorage.getItem('CompanyId');
    try {
      return this.httpClient
        .get(
          `${this.CompanySizeUpdateApiUrl}?domain=${this.Domain}&ComId=${companyId}&minvalue=${minValue}&maxvalue=${maxValue}`,
          {
            withCredentials: true,
          }
        )
        .pipe(
          catchError(() => {
            return of({ notUpdated: true });
          })
        );
    } catch {
      return of({ notUpdated: true });
    }
  }
}
