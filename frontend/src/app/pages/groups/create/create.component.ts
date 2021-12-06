import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { GroupService } from 'src/app/core/services/group.service';
import { Group, GroupType } from 'src/app/models/group.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  constructor(private router: Router, private groupService: GroupService, private authService: AuthService) { }
  
  groupTypeOptions: string[] = ['Private', 'Public', 'Private and Invisible'];
  
  errorMessage: string = '';
  groupNameInput: string;
  groupTypeInput: string;

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    if (!this.authService.getUser()) {
      this.router.navigate(['/login']);
    }
  }

  creatGroup = () => {
    console.log(this.groupTypeInput);
    if (!this.groupNameInput) {
      this.errorMessage = 'Please provide a group name'
    }
    else {
      let type: GroupType;
      if (this.groupTypeInput === this.groupTypeOptions[0]) {
        type = GroupType.PRIVATE_GROUP
      }
      else if (this.groupTypeInput === this.groupTypeOptions[1]) {
        type = GroupType.PUBLIC_GROUP
      }
      else if (this.groupTypeInput === this.groupTypeOptions[2]) {
        type = GroupType.PRIVATE_INVISIBLE_GROUP
      }
      else {
        this.errorMessage = 'You somehow managed to get an invalid Group type...'
        return
      }
      this.groupService.createGroup(this.groupNameInput, type)
        .subscribe(
          (group: Group) => {
            this.router.navigate([`/group/${group.groupId}/overview`]);
          },
          (err: HttpErrorResponse) => {
            this.errorMessage = `An error (${err.status}) occured, please try again later`
          }
        );
    }
  }

}
