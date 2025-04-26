import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginPageCountService {
  private readonly DOMAIN = window.location.href.includes('gateway')
    ? 'gbh'
    : window.location.href.includes('localhost')
    ? 'lbh'
    : 'rbh';

  // private readonly DOMAIN = window.location.href.includes('test4')
  //   ? 'test4'
  //   : 'test4';

  private readonly JOB_AD_ENDPOINT: string = `https://corporate3.bdjobs.com/getJobAds.asp?cid=&bda=${this.DOMAIN}`;
  private readonly CV_BANK_ENDPOINT: string = `https://corporate3.bdjobs.com/getCvBank.asp?cid=&bda=${this.DOMAIN}`;
  private readonly JOB_APPLICATION_ENDPOINT: string = `https://jobs.bdjobs.com/getJobApplied2.asp?cid=&bda=${this.DOMAIN}`;

  constructor(private httpClient: HttpClient) {}

  getJobAdCount(): Observable<any> {
    return this.httpClient.get(this.JOB_AD_ENDPOINT, { responseType: 'text' });
  }

  getCvBankCount(): Observable<any> {
    return this.httpClient.get(this.CV_BANK_ENDPOINT, { responseType: 'text' });
  }

  getApplicationCount(): Observable<any> {
    return this.httpClient.get(this.JOB_APPLICATION_ENDPOINT, {
      responseType: 'text',
    });
  }
}
