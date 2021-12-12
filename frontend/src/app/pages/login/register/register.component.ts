import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usernameInput: string;
  passwordInput: string;
  confirmPasswordInput: string;

  errorMessage: string = '';
  registering: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
  }

  register = () => {
    if (!this.usernameInput || !this.passwordInput || !this.confirmPasswordInput) {
      this.errorMessage = 'All fields must be provided';
    }
    else if (this.passwordInput !== this.confirmPasswordInput) {
      this.errorMessage = 'Passwords must match';
    }
    else if (!this.registering){
      this.errorMessage = ''

      this.registering = true;
      this.authService.registerUser(this.usernameInput, this.passwordInput)
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        (err: HttpErrorResponse) => {
          if (err.status === 409)
            this.errorMessage = 'Username already exists, please pick another one'
          else
            this.errorMessage = 'An error occurred, please try again later';
          this.registering = false;
        }
      );
    }
  }
}
