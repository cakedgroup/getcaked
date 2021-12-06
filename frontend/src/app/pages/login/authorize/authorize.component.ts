import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.css']
})
export class AuthorizeComponent implements OnInit {

  errorMessage: string = '';
  loggingIn: boolean = false;

  usernameInput: string;
  passwordInput: string;

  constructor(private authService: AuthService, private router: Router) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
  }

  login = (): void => {
    if (!this.usernameInput || !this.passwordInput) {
      this.errorMessage = 'All fields must be provided';
    }
    else if (!this.loggingIn){
      this.errorMessage = ''

      this.loggingIn = true;
      this.authService.authorizeUser(this.usernameInput, this.passwordInput)
      .subscribe(
        () => {
          this.router.navigate(['/']);
        }, 
        (err: HttpErrorResponse) => {
          this.errorMessage = 'Invalid credentials, please try again';
          this.loggingIn = false;
        }
      );
    }
  }

}
