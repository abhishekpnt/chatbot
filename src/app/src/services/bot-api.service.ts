import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class BotApiService {
  private readonly host = 'https://dev.aiassistant.sunbird.org/all_bot/v1/';

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
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
      const apiUrl = this.host + 'submit_response';
      return this.http.post<any>(apiUrl, req, { headers: this.getHeaders() });
    } else {
      const apiUrl = this.host + 'get_content';
      return this.http.post<any>(apiUrl, req, { headers: this.getHeaders() });
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });
  }
}
