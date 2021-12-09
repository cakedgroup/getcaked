import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  currentUsername: string;
  updated: boolean = false;

  newUsername: string;
  newPassword: string;
  errorMessage: string;

  constructor(private userService: UserService, private router: Router, private authService: AuthService) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    this.currentUsername = this.authService.getUser().username;
  }

  saveUserSettings = () => {
    this.userService.changeUserInfo(this.newUsername, this.newPassword)
      .subscribe(
        () => {
          this.currentUsername = this.authService.getUser().username;
          this.updated = true;
          this.errorMessage = '';
        },
        (err: HttpErrorResponse) => {
          if (err.status === 409) 
            this.errorMessage = 'That username already exists, please try another one'
          else
            this.errorMessage = `An unexpected error (${err.status}) occurred while updating`
        }
      );
  }

}
