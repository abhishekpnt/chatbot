import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class BotApiService {
  apiUrl = 'https://dev.aiassistant.sunbird.org/all_bot/v1/learn_language';

  constructor(
    private http: HttpClient,
    private sessionService: SessionService
  ) { }

  getBotMessage(text: string, audio: string, botType: string, lang: any): Observable<any> {
    // console.log('text ', text, text !== "");
    // console.log('audio ', audio, audio !== "");

    // If session ID is not available (e.g., session expired), generate a new one
    if (!this.sessionService.getSessionId()) {
      this.sessionService.generateSessionId();
    }

    // Get session ID again
    const sessionId = this.sessionService.getSessionId();

    console.log('----ssid', sessionId)
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
        language: 'ta',
        audio: audio,
        session_id: sessionId
      }
    }

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(this.apiUrl, req, { headers });
  }
}



