import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CvDetails } from '../../models/Cv-Details/response/cv-details';
import { GenericAPIRequest } from '../../models/Cv-Details/request/GenericAPIRequest';
import { CheckValidityRequest } from '../../models/Cv-Details/request/CheckValidityRequest';
import { JobInformationUpdateRequest } from '../../models/Cv-Details/request/JobInformationUpdateRequest';
import { CheckValidityResponse } from '../../models/Cv-Details/response/CheckValidityResponse';
import { ActionDataResponseModel, ApplicantData, DownloadCVRequest } from '../../models/Cv-Details/response/cvActionData';
import { CvDetailsAccessCheck } from '../../models/Cv-Details/CvViewUrlParams';

@Injectable({
  providedIn: 'root',
})
export class DataServiceService {
  //private readonly Generic_Query_Engine_Url = "https://testmongo.bdjobs.com/test_redwan/Mongo/Query";
  private readonly Generic_Query_Engine_Url =
    'https://recruiter.bdjobs.com/queryengine/Mongo/Query';
  private readonly Check_Validity_API_Url =
    'https://testmongo.bdjobs.com/v1/api/JobInformation/CheckValidity';
  private readonly UPDATE_JOB_INFORMATION_API_URL =
    'https://testmongo.bdjobs.com/v1/api/JobInformation/jobInformationUpdate';

  private readonly checkPnplCvCheckURL = 'https://api.bdjobs.com/EmployerApi/api/ApplicantCVInfo';

  private ApiUrlForPdfDownload = 'https://recruiter.bdjobs.com/profilepdfgenerator/api/PdfGenerator/generate-pdf-zip';
  http: any;

  constructor(private httpClient: HttpClient) {}

  getCVinformation(applicantId: string): Observable<CvDetails[]> {
    const apiRequest: GenericAPIRequest = {
      // collectionName: 'test_etl',
      collectionName: 'JobSeekerCollection',
      projections: [],
      filters: [
        {
          operator: 'or',
          attributes: [
            {
              fieldName: 'ApplicantId',
              equalityOperator: '=',
              value: applicantId.toString(),
              valueType: 'Int32',
            },
          ],
        },
      ],
      orderBy: [],
      page: 1,
      pageSize: 10,
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.httpClient
      .post(this.Generic_Query_Engine_Url, apiRequest, {
        headers,
        responseType: 'text',
      })
      .pipe(map((response) => this.parseResponse(response) as CvDetails[]));
  }

  private parseResponse(response: string): any {
    const responseWithFixedDates = this.fixIsoDateStrings(response);
    const parsedResponse = JSON.parse(responseWithFixedDates);
    return this.convertDates(parsedResponse);
  }

  private fixIsoDateStrings(response: string): string {
    const isoDateRegex = /ISODate\("([^"]+)"\)/g;
    return response.replace(isoDateRegex, (_, dateString) => `"${dateString}"`);
  }

  private convertDates(obj: any): any {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (typeof obj[prop] === 'object') {
          obj[prop] = this.convertDates(obj[prop]);
        } else if (
          typeof obj[prop] === 'string' &&
          obj[prop].startsWith('ISODate("') &&
          obj[prop].endsWith('")')
        ) {
          obj[prop] = new Date(obj[prop].substring(9, obj[prop].length - 2));
        }
      }
    }
    return obj;
  }

  checkValidity(data: CheckValidityRequest): Observable<CheckValidityResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post<CheckValidityResponse>(
      this.Check_Validity_API_Url,
      data,
      { headers }
    );
  }

  updateJobInformation(data: JobInformationUpdateRequest): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(this.UPDATE_JOB_INFORMATION_API_URL, data, {
      headers,
    });
  }

  shortlist(jobId?: string, applyID?: string) {
    const strurl =
      'https://corporate3.bdjobs.com/Applicant_Process_MoveToActivity_mongo_api.asp?domain=gateway';
    // 'https://corporate3.bdjobs.com/Applicant_Process_MoveToActivity_mongo_api-tst.asp?domain=gateway';
    const requestBody = `applyID=${applyID}&actType=sltyp&currentAct=0&currentActType=al&multipleAct=0&jid=${jobId}`;
    // const options = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   }),
    // };
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      withCredentials: true,
    };
    return this.httpClient.post(strurl, requestBody, options);
  }

  rejectCV(jobId?: string, applyID?: string, action?: string) {
    const requestBody = `applyID=${applyID}&actVal=${action}&jpid=${jobId}`;
    // console.log(requestBody, 'requestBody');

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      withCredentials: true,
    };
    return this.httpClient.post(
      // `https://corporate3.bdjobs.com/Applicant_Process_Rejected_mongo_api.asp?acttype=rej&actVal=1&idn=${idn}&jid=${jobId}&applyID=${applyID}&jpid=${jobId}&domain=gateway`,
      'https://corporate3.bdjobs.com/Applicant_Process_Rejected_mongo_api.asp?domain=gateway',
      requestBody,
      options
    );
  }

  cvPdfDownload(data: any): Observable<any> {
    return this.httpClient.post(this.ApiUrlForPdfDownload, data, { responseType: 'blob' });
  }

  checkIsPnplLocked(data: any): Observable<any> {
    return this.httpClient.post(this.checkPnplCvCheckURL, data);
  }

  checkCvAccess(companyId: string, idn: string, companyName: string): Observable<any> {
    const domainName = isDevMode() ? 'test' : 'recruiter';

    const params = {
      domain: domainName,
    };

    const requestBody = `comId=${companyId}&idn=${idn}&comName=${companyName}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      withCredentials: true,
      params
    };
    return this.httpClient.post(
      'https://corporate3.bdjobs.com/cvBankAccessCheck_test_sajal.asp',
      requestBody,
      options
    );
  }

  checkHaveCvAccess(data: CvDetailsAccessCheck): Observable<any> {
    const url = 'https://gateway.bdjobs.com/CVBank/api/CvBankAccess/CvBankAccessCheck'; // Replace with the actual URL
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.httpClient.post(url, data, { headers });
  }



  getCvActionData(companyId: string, idn: string, haveAccess: number): Observable<ActionDataResponseModel> {

    const domainName = isDevMode() ? 'test' : 'recruiter';

    const params = {
      companyid: companyId,
      idn: idn,
      havecvaccess: haveAccess.toString(),
      domain: domainName,
    };

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      withCredentials: true,
      params: params
    };

    return this.httpClient.get<ActionDataResponseModel>(
      'https://corporate3.bdjobs.com/CvDetailsActionData.asp',
      options
    );
  }

  downloadCustomcV(name: string, id: string, fileFormat: string): void {
    const baseUrl = 'https://corporate3.bdjobs.com/AttachedCVDownload.asp';
    const domainName = isDevMode() ? 'test' : 'recruiter';
  
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = baseUrl;
    form.target = '_blank';
  
    const addHiddenField = (name: string, value: string) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };
  
    addHiddenField('hidApplIdn', id);
    addHiddenField('hidAppName', name);
    addHiddenField('hidAppCVFormate', '1');
    addHiddenField('hidCVBank', '1');
    addHiddenField('hidDownloadType', 'vresume');
    addHiddenField('domain', domainName);
  
    document.body.appendChild(form);
  
    // Debugging the form fields
    console.log('Form before submission:', form);
  
    // Ensure the form is in the DOM before submitting
    setTimeout(() => {
      form.submit();
      document.body.removeChild(form);
    }, 0);
  }
  

  addOrUpdateComment(comment: string, rating: number, viewedId: number): Observable<any> {
    const domainName = isDevMode() ? 'test' : 'recruiter';
    const params = {
      Comments: comment,
      rating: rating.toString(),
      id: viewedId.toString(),
      domain: domainName
    };

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
      withCredentials: true,
      params: params
    };

    return this.httpClient.get(
      'https://corporate3.bdjobs.com/CVComments.asp',
      options
    );
  }


}
