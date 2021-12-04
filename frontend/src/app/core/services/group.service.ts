import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group, GroupType } from 'src/app/models/group.model';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private readonly basePath = 'http://' + environment.url + '/api';

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
}
