import { Component, OnInit } from '@angular/core';
import {User} from '../../../models/user.model';
import {CakeEvent} from '../../../models/cake.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {UserService} from '../../../core/services/user.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  user: User;
  cakeEvents: CakeEvent[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.userService.getCakeEvents(this.user.userId)
      .subscribe(
        (cakeEvents: CakeEvent[]) => {
          this.cakeEvents = cakeEvents;
        }
      )
  }

}
