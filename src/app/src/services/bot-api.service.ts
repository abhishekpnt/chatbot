import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BotApiService {
  private readonly host = 'https://dev.aiassistant.sunbird.org/all_bot/v1/';
  apiUrl
  constructor(
    private http: HttpClient,
  ) { }

  getBotMessage(text: string, audio: string, lang: any): Observable<any> {
    const req: any = {
      user_id: localStorage.getItem('token'),
      language: lang,
    };

    if (text) {
      req.original_text = text;
    }

    if (audio) {
      req.audio = audio;
    }

    if (localStorage.getItem('content_id')) {
      req.content_id = localStorage.getItem('content_id');
      this.apiUrl = this.host + 'submit_response';
    } else {
      this.apiUrl = this.host + 'get_content';
    }
    return this.http.post<any>(this.apiUrl, req, { headers: this.getHeaders() });

  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
  }
}
