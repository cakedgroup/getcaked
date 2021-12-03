import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from 'src/app/models/group.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupServiceService {

  private readonly basePath = 'http://' + environment.url + '/api';

  constructor(private http: HttpClient) { }

  listGroups(): Observable<Group[]> {
      return this.http.get<Group[]>(`${this.basePath}/groups`);
  }
}
