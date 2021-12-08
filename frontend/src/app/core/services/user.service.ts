import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {CakeEvent} from '../../models/cake.model';

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
}
