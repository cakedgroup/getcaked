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

  groupErrorMessage: string = '';
  userErrorMessage: string = '';
  groupNameInput: string;
  groupTypeInput: string;

  groupId: string;
  adminIdInput: string;
  userIdInput: string;

  userAddedSuccessfully: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private groupService: GroupService,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.groupId = this.route.snapshot.params['groupId'];

    this.groupService.getGroup(this.groupId)
      .subscribe(
        (group: Group) => {
          this.group = group;
        },
        (err: HttpErrorResponse) => {
          this.router.navigate(['/404']);
        }
      );

    this.groupService.getInviteToken(this.groupId)
        .subscribe(
          (token: string) => {
            this.inviteLink = `${environment.frontend_url}/join/${token}`;
          },
          (err) => {
            console.log(err);
            if (err.status === 404) this.router.navigate(['/404']);
          }
        );

    this.loadUsersOfgroup();
  }

  loadUsersOfgroup() {
    this.groupService.getUsersOfGroup(this.groupId)
    .subscribe(
      (users: User[]) => {
        this.members = users;
      },
      (err) => {
        console.log(err);
      }
    );
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
          this.loadUsersOfgroup();
          this.userAddedSuccessfully = true;
          this.userErrorMessage = '';
        },
        (err: HttpErrorResponse) => {
          if (err.status === 409)
            this.userErrorMessage = 'User already added';
          else
            this.userErrorMessage = 'User could not be added'
          this.userAddedSuccessfully = false;
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
    if (!this.groupNameInput && this.groupTypeInput === this.groupTypeOptions[0] && !this.adminIdInput) {
      this.groupErrorMessage = 'no changes entered'
    }
    else {
      let type = null;
      if (this.groupTypeInput !== this.groupTypeOptions[0]) {
        if (this.groupTypeInput === this.groupTypeOptions[1]) {
          type = GroupType.PRIVATE_GROUP
        }
        else if (this.groupTypeInput === this.groupTypeOptions[2]) {
          type = GroupType.PUBLIC_GROUP
        }
        else if (this.groupTypeInput === this.groupTypeOptions[3]) {
          type = GroupType.PRIVATE_INVISIBLE_GROUP
        }
      }
      this.groupService.changeInfos(this.group.groupId, this.groupNameInput, type, this.adminIdInput)
        .subscribe(
          () => {
            this.router.navigate([`/group/${this.group.groupId}/overview`])
          },
          (err: HttpErrorResponse) => {
            switch (err.status) {
              case 400:
                this.groupErrorMessage = 'no Parameters given';
                break;
              case 403:
                this.groupErrorMessage = 'you are not allowed to change the group\'s info';
                break;
              case 418:
                this.groupErrorMessage = 'new Admin is not yet part of the group and thus can\'t be the new Admin';
                break;
              default:
                console.log(err.status);
                this.groupErrorMessage = 'something went wrong - nothing changed';
                break;
            }
          }
        );
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
