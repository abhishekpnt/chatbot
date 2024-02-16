import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// import { config } from '../environments/environments.prod';
// import { TranslateService } from '@ngx-translate/core';
// import { ApiService } from '.';
// import { ApiHttpRequestType, ApiRequest } from './api/model/api.request';
// import { catchError, lastValueFrom, map, tap } from 'rxjs';
// import { ApiResponse } from './api/model/api.response';


@Injectable({
  providedIn: 'root'
})
export class BotApiService {
  apiUrl = 'https://dev.aiassistant.sunbird.org/djp/v1/query';

  constructor(
    private http: HttpClient

  ) { }

  getBotMessage(text: string, audio: string, botType: string, lang: any): Observable<any> {
    // console.log('text ', text, text !== "");
    // console.log('audio ', audio, audio !== "");
    let req: any = {
      input: {},
      output: {
        format: text ? "text" : "audio"
      }
    }
    
    if (text !== "") {
      req.input = {
        language: lang,
        text: text
      }
    } else if (audio !== "") {
      req.input = {
        language: lang,
        audio: audio,
        audienceType: 'parent'
      }
    }

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-request-id': '25345346'
    });

    return this.http.post<any>(this.apiUrl, req, { headers });
  }

}



