import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CakeService {

  private readonly basePath = environment.backend_url + '/api';

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  startCakingSequence(groupId: string, cakeName?:string): Observable<string> {
    if (this.authService.getUser() === null)
      return this.http.post<GameResponse>(
        `${this.basePath}/games`, 
        {
          groupId: groupId,
          cakeVictimName: cakeName
        },
      )
      .pipe(
        map((gameRes) => {
          return gameRes.gameToken
        })
      );
    else
      return this.http.post<GameResponse>(
        `${this.basePath}/games`, 
        {
          groupId: groupId
        },
        {headers: this.authService.getAuthHeader()}
      )
      .pipe(
        map((gameRes) => {
          return gameRes.gameToken
        })
      );
  }

  createCakeEvent(gameToken: string) {
    if (this.authService.getUser() === null)
      return this.http.post(
        `${this.basePath}/cakeEvents`,
        {
          gameToken: gameToken
        }
      );
    else  
      return this.http.post(
        `${this.basePath}/cakeEvents`,
        {
          gameToken: gameToken
        },
        {headers: this.authService.getAuthHeader()}
      );
  }
}

interface GameResponse {
  gameToken: string
}