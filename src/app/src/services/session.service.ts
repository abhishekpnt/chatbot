import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private readonly SESSION_ID_KEY = 'sessionId';

  constructor() { }

  generateSessionId(): string {
    // Generate a UUID (v4) for the session ID
    const sessionId = uuidv4();
    // Store the session ID in SessionStorage
    sessionStorage.setItem(this.SESSION_ID_KEY, sessionId);
    return sessionId;
  }

  getSessionId(): string | null {
    // Retrieve the session ID from SessionStorage
    return sessionStorage.getItem(this.SESSION_ID_KEY);
  }
}
