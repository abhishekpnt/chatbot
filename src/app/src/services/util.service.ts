
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  constructor() {
  }

  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getItem(key: string) {
    return localStorage.getItem(key);
  }

  removeItem(key:string){
    return localStorage.removeItem(key)
  }

  getLanguage() {
    return this.getItem('language')
  }
  setLanguage(language) {
    this.setItem('language', language)
  }
}
