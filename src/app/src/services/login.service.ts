import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private tokenKey = 'token';

  constructor(private http: HttpClient,   private router: Router) { }


public login(username: string, password: string): void {
let authenticationUrl=`https://www.learnerai-dev.theall.ai/v1/vid/generateVirtualID?username=${username}&password=${password}`

 this.http.get(authenticationUrl).subscribe((token) => {
console.log('=----',token['virtualID'])
     localStorage.setItem(this.tokenKey, token['virtualID']);
     this.router.navigate(['']);
  });
}


public logout() {
  localStorage.removeItem(this.tokenKey);
  this.router.navigate(['/login']);
}

public isLoggedIn(): boolean {
  let token = localStorage.getItem(this.tokenKey);
  return token != null && token.length > 0;
}

public getToken(): string | null {
  return this.isLoggedIn() ? localStorage.getItem(this.tokenKey) : null;
}
}