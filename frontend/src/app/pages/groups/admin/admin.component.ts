import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { GroupService } from 'src/app/core/services/group.service';
import { Group, GroupType } from 'src/app/models/group.model';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  group: Group = {groupId: '', groupName: '', type: GroupType.PUBLIC_GROUP, adminId: ''};
  inviteLink: string;
  members: User[];

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
        }
      );
    
    this.groupService.getInviteToken(groupId)
        .subscribe(
          (token: string) => {
            this.inviteLink = `${environment.frontend_url}/join/${token}`;
          },
          (err) => {
            console.log(err);
          }
        );
        
    this.groupService.getUsersOfGroup(groupId)
        .subscribe(
          (users: User[]) => {
            this.members = users;
          },
          (err) => {
            console.log(err);
          }
        )
  }

  isAdmin(): boolean {
    if (!this.authService.getUser())
      return false;
    else 
      return this.authService.getUser().userId === this.group.adminId;
  }

  deleteGroup = () => {
    if (window.confirm('Are you sure you want to delete ' + this.group.groupName + '?')){
      this.groupService.deleteGroup(this.group.groupId)
        .subscribe(
          () => {
            this.router.navigate(['/']);
          }
        );
    }
  }
}
