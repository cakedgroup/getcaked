import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Group } from 'src/app/models/group.model';
import { AuthService } from '../services/auth.service';
import { GroupService } from '../services/group.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router, 
    private authService: AuthService,
    private groupService: GroupService
) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
     return this.groupService.getGroup(route.params['groupId'])
        .pipe<boolean | UrlTree>(
          map(
            (group: Group) => {
              if (group.adminId === this.authService.getUser().userId)
                return true;
              else
                return this.router.parseUrl('/login');
            }
          )
        )


    
  }
  
}
