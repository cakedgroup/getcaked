import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Group, GroupType } from 'src/app/models/group.model';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import {CakeEvent} from '../../models/cake.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private readonly basePath = environment.backend_url + '/api';

  constructor(private http: HttpClient, private authService: AuthService) { }

  listGroups(searchQuery?: string): Observable<Group[]> {
    let params: HttpParams = new HttpParams();
    let headers: HttpHeaders;

    if (searchQuery) params = params.append('search', searchQuery);

    if (this.authService.getUser() === null) headers = new HttpHeaders();
    else headers = this.authService.getAuthHeader();

    return this.http.get<Group[]>(
      `${this.basePath}/groups`,
      {
        headers: headers,
        params: params
      }
    );
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

  changeInfos(groupId: string, groupName: string, type: GroupType | null, newAdminId: string): Observable<void> {
    let body : {[keys: string]: any} = {};
    if (groupName) {
      body.groupName = groupName;
    }
    if (type) {
      body.type = type;
    }
    if (newAdminId) {
      body.newAdminId = newAdminId;
    }

    return this.http.patch<void>(
      `${this.basePath}/groups/${groupId}`,
      body, {
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

  addUser(groupId: string, userId: string): Observable<void> {
    return this.http.post<void>(
      `${this.basePath}/groups/${groupId}/users`,
      {
        userId: userId,
      },
      {headers: this.authService.getAuthHeader()},
    );
  }

  joinGroup(inviteToken: string, groupId: string): Observable<void> {
    return this.http.post<void>(
      `${this.basePath}/groups/${groupId}/users`,
      {
        userId: this.authService.getUser().userId,
        invitetoken: inviteToken,
      },
      {headers: this.authService.getAuthHeader()},
    );
  }

  removeUser(groupId: string, userId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.basePath}/groups/${groupId}/users/${userId}`,
      {headers: this.authService.getAuthHeader()}
    );
  }

  getUsersOfGroup(groupId:string): Observable<User[]> {
    if (this.authService.getUser() !== null)
      return this.http.get<User[]>(`${this.basePath}/groups/${groupId}/users`, {headers: this.authService.getAuthHeader()});
    else
      return this.http.get<User[]>(`${this.basePath}/groups/${groupId}/users`);
  }

  getCakeEvents(groupId:string): Observable<CakeEvent[]> {
    if (this.authService.getUser() !== null)
      return this.http.get<CakeEvent[]>(`${this.basePath}/groups/${groupId}/cakeEvents`, {headers: this.authService.getAuthHeader()});
    else
      return this.http.get<CakeEvent[]>(`${this.basePath}/groups/${groupId}/cakeEvents`);
  }
}

interface TokenWrapper {
  invitetoken: string
}
