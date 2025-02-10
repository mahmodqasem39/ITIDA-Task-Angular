import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private registerUrl = 'http://localhost:5296/api/Account/Register';
  private loginUrl = 'http://localhost:5296/api/Account/Login'

  constructor(private http: HttpClient) {}

  register(userModel: any): Observable<any> {
    return this.http.post<any>(this.registerUrl, userModel);
  }
  

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.loginUrl}`, credentials).pipe(
      tap(
        response => {
        if (response.success && response.payload?.token) {
          localStorage.setItem('token', response.payload.token);
          localStorage.setItem('token_expiry', response.payload.expiresIn);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decodedToken: any = this.decodeToken(token);
      return decodedToken?.userId || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1]; 
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); 
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
  
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }
  
}
