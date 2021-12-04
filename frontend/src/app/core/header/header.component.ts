import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
  }

  routeIsHomepage(): boolean {
    return this.router.url === '/';
  }

  routeIsGroupPage(): boolean {
    return this.router.url.startsWith('/groups');
  }

  isLoggedIn(): boolean {
    return this.authService.getUser() !== null;
  }
}
