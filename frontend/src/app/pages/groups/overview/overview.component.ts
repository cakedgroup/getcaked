import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { GroupService } from 'src/app/core/services/group.service';
import { Group, GroupType } from 'src/app/models/group.model';
import {CakeEvent} from '../../../models/cake.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  group: Group = {groupId: '', groupName: '', type: GroupType.PUBLIC_GROUP, adminId: ''};
  cakeEvents: CakeEvent[];
  mostRecentCake: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    let groupId = this.route.snapshot.params['groupId'];

    this.groupService.getGroup(groupId)
      .subscribe(
        (group: Group) => {
          this.group = group;
        },
        (err: HttpErrorResponse) => {
          this.router.navigate(['/404']);
        })

    this.groupService.getCakeEvents(groupId)
      .subscribe(
        (cakeEvents: CakeEvent[]) => {
          this.cakeEvents = cakeEvents;
          const user = this.authService.getUser();
          if (user && this.cakeEvents[0].username === user.username) {
            this.mostRecentCake = "You"
          }
          else {
            this.mostRecentCake = this.cakeEvents[0].username;
          }
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        })

    // Scroll to top when navigating to overview
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  isAdmin(): boolean {
    if (!this.authService.getUser())
      return false;
    else
      return this.authService.getUser().userId === this.group.adminId;
  }
}
