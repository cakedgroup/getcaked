import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly basePath = 'http://' + environment.url + '/api';
  private user: User;
  private authToken: string;


  constructor(private http: HttpClient) { 
    this.user = JSON.parse(localStorage.getItem('user'));
    this.authToken = localStorage.getItem('authtoken');
  }

  authorizeUser(username: string, password: string): Observable<void> {
    return this.http.post<AuthInfo>(`${this.basePath}/auth`, {username: username, password: password})  
    .pipe<void>(
      map((authInfo: AuthInfo): void => {
        this.user = {username: username, userId: authInfo.userId};
        this.authToken = authInfo.jwt;

        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('authtoken', this.authToken);
      })
    );
  }

  registerUser(username: string, password: string): Observable<void> {
    return this.http.post<AuthInfo>(`${this.basePath}/users`, {username: username, password: password})
    .pipe<void>(
      map((authInfo: AuthInfo): void => {
        this.user = {username: username, userId: authInfo.userId};
        this.authToken = authInfo.jwt;

        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('authtoken', this.authToken);
      })
    )
  }

  getUser(): User | null {
    if (this.user === undefined)
      return null;
    else
      return this.user;
  }

  logoutUser() {
    localStorage.removeItem('user');
    localStorage.removeItem('authtoken');

    this.user = undefined;
    this.authToken = undefined;
  }
}

interface AuthInfo {
  userId: string,
  jwt: string
}