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

  groupTypeOptions: string[] = ['unchanged', 'Private', 'Public', 'Private and Invisible'];

  errorMessage: string = '';
  groupNameInput: string;
  groupTypeInput: string;

  userIdInput: string;

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

  addUser = () => {
    this.groupService.addUser(this.group.groupId, this.userIdInput)
      .subscribe(
        () => {
          window.location.reload();
        },
        () => {

        }
      );
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

  confirmChanges = () => {
    if (!this.groupNameInput && this.groupTypeInput === this.groupTypeOptions[0]) {
      this.errorMessage = 'no changes entered'
    }
    else {
      if (this.groupTypeInput === this.groupTypeOptions[0]) {
        this.groupService.changeInfos(this.group.groupId, this.groupNameInput, null)
          .subscribe(
            () => {
              this.router.navigate([`/group/${this.group.groupId}/overview`])
            },
            () => {
              this.errorMessage = 'something went wrong - nothing changed';
            }
          );
      }
      else {
        let type = this.group.type
        if (this.groupTypeInput === this.groupTypeOptions[1]) {
          type = GroupType.PRIVATE_GROUP
        }
        else if (this.groupTypeInput === this.groupTypeOptions[2]) {
          type = GroupType.PUBLIC_GROUP
        }
        else if (this.groupTypeInput === this.groupTypeOptions[3]) {
          type = GroupType.PRIVATE_INVISIBLE_GROUP
        }
        this.groupService.changeInfos(this.group.groupId, this.groupNameInput, type)
          .subscribe(
            () => {
              this.router.navigate([`/group/${this.group.groupId}/overview`])
            },
            () => {
              this.errorMessage = 'something went wrong - nothing changed';
            }
          );
      }
    }
  }

  removeMember = (userId: string, username: string) => {
    if (userId === this.group.adminId) {
      alert("Admin can't be removed");
    }
    else if (window.confirm(`Are you sure you want to remove ${username} from this group?`)) {
      this.groupService.removeUser(this.group.groupId, userId)
        .subscribe( () => {
            window.location.reload();
          },
          () => {

          }
        );
    }
  }
}
