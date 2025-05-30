import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { CreditSystemResponse } from '../../models/CreditSystem/Credit';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root',
})
export class CreditSystemService {
  private readonly DOMAIN_PARAM = window.location.href.includes('gateway')
    ? 'domain=gateway&'
    : window.location.href.includes('localhost')
    ? 'domain=lbh&'
    : '';
  private creditSystemUrl =
    // 'https://corporate3.bdjobs.com/CreditSystemDataForDashboard.asp?domain=lbh';
    'https://corporate3.bdjobs.com/CreditSystemDataForDashboard.asp?' +
    this.DOMAIN_PARAM;

  constructor(
    private httpClient: HttpClient,
    private loginService: LoginService
  ) {}
  callCreditSystemCheckReferral(comid: string, comname: string, token: string) {
    const url =
      // 'https://corporate3.bdjobs.com/CreditSystem-Check-Referral.asp?domain=test4';
      'https://corporate3.bdjobs.com/CreditSystem-Check-Referral.asp?domain=recruiter';
    const body = new URLSearchParams();
    body.set('comid', comid);
    body.set('comname', comname);
    body.set('token', token);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.httpClient.post<any>(url, body.toString(), {
      headers,
      withCredentials: true,
    });
  }
  getCreditDetails(
    companyId: string,
    companyName: string,
    fromDate: string,
    toDate: string
  ): Observable<CreditDetailsData> {
    const DOMAIN = window.location.href.includes('gateway')
      ? 'gateway'
      : window.location.href.includes('localhost')
      ? 'lbh'
      : 'recruiter';
    const url =
      // 'https://corporate3.bdjobs.com/CreditSystem-Check-Referral.asp?domain=test4';
      // 'https://corporate3.bdjobs.com/CreditSystem-Data-Details.asp?domain=recruiter';
      // 'https://corporate3.bdjobs.com/CreditSystem-Data-Details.asp?domain=lbh';
      'https://corporate3.bdjobs.com/CreditSystem-Data-Details.asp?domain=' +
      DOMAIN;
    const body = new URLSearchParams();
    body.set('comid', companyId);
    body.set('filterfor', companyName);
    body.set('fromdate', fromDate);
    body.set('todate', toDate);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.httpClient.post<CreditDetailsData>(url, body.toString(), {
      headers,
      withCredentials: true,
    });
  }
  getCreditSystem(): Observable<CreditSystemResponse | null> {
    var companyId = '';
    this.loginService.getCompanyId().subscribe({
      next: (data) => {
        if (data) {
          companyId = data;
        }
      },
    });
    return this.httpClient
      .get<CreditSystemResponse>(this.creditSystemUrl + 'comdata=' + companyId)
      .pipe(
        map((response) => {
          if (response.status === 200 && response.message === 'success') {
            return response;
          } else {
            throw new Error('Failed to fetch credit system data');
          }
        }),
        catchError((error) => {
          console.error('Error fetching credit system data:', error);
          return of(null);
        })
      );
  }
  formatDate(inputDate: string): string {
    const [datePart, timePart] = inputDate.split(' ');
    const [month, day, year] = datePart.split('/');
    const date = new Date(`${year}-${month}-${day}`);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };

    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(
      date
    );
    return formattedDate;
  }
  // formatDate(inputDate: string): string {
  //   const [datePart, timePart] = inputDate.split(' ');
  //   const [month, day, year] = datePart.split('/');
  //   const date = new Date(`${year}-${month}-${day}`);
  //   const options: Intl.DateTimeFormatOptions = {
  //     day: 'numeric',
  //     month: 'long',
  //     year: 'numeric',
  //   };
  //   return date.toLocaleDateString('en-US', options);
  // }

  getDummyData(): CreditDetailsData {
    const dummyCreditDetailsData: CreditDetailsData = {
      Error: '',
      Message: 'Success',
      TokenData: [
        {
          tNo: 1,
          tId: 123456,
          tOrgId: 987654,
          tDate: '04/30/2024',
          tCreditUsed: 50,
        },
        {
          tNo: 2,
          tId: 234567,
          tOrgId: 876543,
          tDate: '03/30/2021',
          tCreditUsed: 30,
        },
       
      ],
      tCreditUsed: 20,
      tCreditTotal: 3200,
      tCreditRemaining: 3180,
      tCreditValidity: '4/19/2024',
    };
    return dummyCreditDetailsData;
  }
  calculateProgress(firstValue: number, secValue: number): number {
    const firstSetep = 100 / firstValue;
    return firstSetep * secValue;
  }
}

export interface CreditDetailsData {
  Error: string;
  Message: string;
  TokenData: TokenData[];
  tCreditUsed: number;
  tCreditTotal: number;
  tCreditRemaining: number;
  tCreditValidity: string;
}
export interface TokenData {
  tNo: number;
  tId: number;
  tOrgId: number;
  tCreditUsed: number;
  tDate: string;
}
