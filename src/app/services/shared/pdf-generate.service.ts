import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfGenerateService {

  constructor(private http: HttpClient) { }

  getImage(imageUrl: string): Observable<string> {
    const request = {
      ImageUrl: imageUrl
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post('https://testmongo.bdjobs.com/v1/api/PdfGenerator/GetImage', request, {
      responseType: 'blob',
      headers: headers
    }).pipe(map((data: Blob) => {
      // Create a blob URL for the image
      return window.URL.createObjectURL(data);
    }));
  }
}
