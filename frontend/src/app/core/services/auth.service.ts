import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly basePath = environment.backend_url + '/api';
  private user: User;
  private authToken: string;
  private password: string;


  constructor(private http: HttpClient) { 
    this.user = JSON.parse(localStorage.getItem('user'));
    this.authToken = localStorage.getItem('authtoken');
    this.password = localStorage.getItem('password');
  }

  authorizeUser(username: string, password: string): Observable<void> {
    this.password = password;

    return this.http.post<AuthInfo>(`${this.basePath}/auth`, {username: username, password: password})  
    .pipe<void>(
      map((authInfo: AuthInfo): void => {
        this.user = {username: username, userId: authInfo.userId};
        this.authToken = authInfo.jwt;

        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('authtoken', this.authToken);
        localStorage.setItem('password', this.password);
      })
    );
  }

  reauthorizeUser(): Observable<void> {
    return this.authorizeUser(this.user.username, this.password);
  }

  registerUser(username: string, password: string): Observable<void> {
    this.password = password;
    return this.http.post<AuthInfo>(`${this.basePath}/users`, {username: username, password: password})
    .pipe<void>(
      map((authInfo: AuthInfo): void => {
        this.user = {username: username, userId: authInfo.userId};
        this.authToken = authInfo.jwt;

        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('authtoken', this.authToken);
        localStorage.setItem('password', this.password);
      })
    )
  }
  
  logoutUser() {
    localStorage.removeItem('user');
    localStorage.removeItem('authtoken');

    this.user = undefined;
    this.authToken = undefined;
  }
  
  getAuthToken(): string | null {
    return this.authToken;
  }

  getAuthHeader(): HttpHeaders {
    return new HttpHeaders({
      Authorization: this.authToken
    });
  }
  
  getUser(): User | null {
    if (this.user === undefined)
      return null;
    else
      return this.user;
  }

  setUser(user: User): void {
    this.user = user;
  }

}

interface AuthInfo {
  userId: string,
  jwt: string
}