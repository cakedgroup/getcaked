import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group, GroupType } from 'src/app/models/group.model';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private readonly basePath = environment.backend_url + '/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  listGroups(): Observable<Group[]> {
      return this.http.get<Group[]>(`${this.basePath}/groups`);
  }

  createGroup(groupName: string, type: GroupType): Observable<Group> {
    return this.http.post<Group>(
      `${this.basePath}/groups`, 
      {
        groupName: groupName, 
        type: type
      }, 
      {
        headers: this.authService.getAuthHeader()
      }
    );
  }

  deleteGroup(groupId: string): Observable<void> {
    return this.http.delete<void>(`${this.basePath}/groups/${groupId}`, {headers: this.authService.getAuthHeader()});
  }

  getGroup(groupId: string): Observable<Group> {
    if (this.authService.getUser() !== null)
      return this.http.get<Group>(`${this.basePath}/groups/${groupId}`, {headers: this.authService.getAuthHeader()});
    else 
      return this.http.get<Group>(`${this.basePath}/groups/${groupId}`);
  }

  getInviteToken(groupId: string): Observable<string> {
    return this.http.get<TokenWrapper>(
      `${this.basePath}/groups/${groupId}/invitetoken`, 
      {headers: this.authService.getAuthHeader()})
      .pipe<string>(
        map((wrapper: TokenWrapper) => {
          return wrapper.invitetoken;
        })
      )
  }

  getUsersOfGroup(groupId:string): Observable<User[]> {
    if (this.authService.getUser() !== null)
      return this.http.get<User[]>(`${this.basePath}/groups/${groupId}/users`, {headers: this.authService.getAuthHeader()});
    else
      return this.http.get<User[]>(`${this.basePath}/groups/${groupId}/users`);
  }
}

interface TokenWrapper {
  invitetoken: string
}
