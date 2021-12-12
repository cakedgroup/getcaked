import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CakeService } from 'src/app/core/services/cake.service';
import { GroupService } from 'src/app/core/services/group.service';
import { Group, GroupType } from 'src/app/models/group.model';
import { User } from 'src/app/models/user.model';
import {CakeEvent} from '../../../models/cake.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  group: Group = {groupId: '', groupName: '', type: GroupType.PUBLIC_GROUP, adminId: ''};
  private members: User[];
  cakeEvents: CakeEvent[];
  mostRecentCake: string;
  userCanCake: boolean = false;

  showingOverview: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private authService: AuthService,
    private cakeService: CakeService
  ) {}

  ngOnInit(): void {
    let groupId = this.route.snapshot.params['groupId'];

    this.groupService.getGroup(groupId)
      .subscribe(
        (group: Group) => {
          this.group = group;
          this.checkIfUserCanCake()

          this.groupService.getCakeEvents(groupId)
          .subscribe(
            (cakeEvents: CakeEvent[]) => {
              this.cakeEvents = cakeEvents;
              const user = this.authService.getUser();
              if (this.cakeEvents[0]){
                if (user && this.cakeEvents[0] && this.cakeEvents[0].username === user.username) {
                  this.mostRecentCake = "You"
                }
                else {
                  this.mostRecentCake = this.cakeEvents[0].username;
                }
              }
            },
            (err: HttpErrorResponse) => {
              console.log(err);
            });

        this.groupService.getUsersOfGroup(groupId)
          .subscribe(
            (users: User[]) => {
              this.members = users;
            },
            (err) => {
              console.log(err);
            }
          );

        },
        (err: HttpErrorResponse) => {
          this.router.navigate(['/404']);
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

  isMember(): boolean {
    if (!this.authService.getUser())
      return false;
    else {
      const userId = this.authService.getUser().userId;
      if (this.members){
        for (let member of this.members) {
          if (member.userId === userId) {
            return true;
          }
        }
      }
      return false;
    }
  }

  leave = () => {
    this.groupService.removeUser(this.group.groupId, this.authService.getUser().userId)
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        () => {

        }
      )
  }

  checkIfUserCanCake() {
    if (this.group.type === GroupType.PUBLIC_GROUP) {
      this.userCanCake = true;
      return;
    }
    else
      this.groupService.getUsersOfGroup(this.group.groupId).subscribe(
        (users: User[]) => {
          if (!this.authService.getUser()) {
            this.userCanCake = false;
          }
          else {
            // check if user is in the group
            this.userCanCake = users.filter(user => user.userId === this.authService.getUser().userId).length > 0;
          }
        },
        () => {
          this.userCanCake = false;
        }
      );
  }

  changeCakeStatus(cakeId:string, cakeDelivered: boolean) {
    this.cakeService.updateCakeStatus(cakeId, cakeDelivered).subscribe();
  }

  switchView(){
    this.showingOverview = !this.showingOverview;
  }
}
