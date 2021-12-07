import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { GroupService } from 'src/app/core/services/group.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {

  inviteToken: string;
  groupId: string

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private groupService: GroupService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.inviteToken = this.route.snapshot.params['inviteToken'];

    if (this.authService.getUser() === null) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      // decode jwt and get groupId field 
      this.groupId = JSON.parse(atob(this.inviteToken.split('.')[1])).groupId;
      this.groupService.joinGroup(this.inviteToken, this.groupId).subscribe(
        () => {
          this.router.navigate([`/group/${this.groupId}/overview`]);
        },
        () => {
          this.router.navigate(['/join/failed']);
        }
      );
    } catch (error) {
      this.router.navigate(['/join/failed']);
    }
  }

}
