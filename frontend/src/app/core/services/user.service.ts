import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {CakeEvent} from '../../models/cake.model';
import { User } from 'src/app/models/user.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly basePath = environment.backend_url + '/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getCakeEvents(userId:string): Observable<CakeEvent[]> {
    if (this.authService.getUser() !== null)
      return this.http.get<CakeEvent[]>(`${this.basePath}/users/${userId}/cakeEvents`, {headers: this.authService.getAuthHeader()});
    else
      return new Observable<CakeEvent[]>((observer) => {
        observer.next([]);
        observer.complete();
      });
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
