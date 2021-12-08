import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly basePath = environment.backend_url + '/api';

  constructor(private http: HttpClient, private authService: AuthService) { 
  }

  changeUserInfo(username: string, password: string): Observable<void> {
    let userUpdateObj: any = {};

    if (username && username !== '')
        userUpdateObj.username = username;
    if (password && password !== '')
        userUpdateObj.password = password;
    return this.http.patch<User>(
        `${this.basePath}/users/${this.authService.getUser().userId}`,
        userUpdateObj,
        {headers: this.authService.getAuthHeader()} 
    ).pipe(
        map((user: User) => {
            this.authService.setUser(user);
            this.authService.reauthorizeUser().subscribe();
        })
    );
  }
  
}
