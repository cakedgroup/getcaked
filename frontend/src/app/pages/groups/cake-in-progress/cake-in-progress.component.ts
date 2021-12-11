import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { CakeService } from 'src/app/core/services/cake.service';

@Component({
  selector: 'app-cake-in-progress',
  templateUrl: './cake-in-progress.component.html',
  styleUrls: ['./cake-in-progress.component.css']
})
export class CakeInProgressComponent implements OnInit {

  groupId: string;

  isEnteringUsername: boolean = false;
  hasCompletedGame: boolean = false;
  userProvidedUsername: string;
  errorMessage: string = '';

  cakeingCounter: number = 30;
  intervalObj: any;
  gameToken: string;


  constructor(
    private authService: AuthService,
    private cakeService: CakeService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.groupId = this.route.snapshot.params['groupId'];
    if (this.authService.getUser() === null) {
      this.isEnteringUsername = true;
    }
    else {
      this.userProvidedUsername = this.authService.getUser().username;
      this.initiateCakeSequence();
    }
  }
  
  finishEntering = () => {
    this.initiateCakeSequence();
    this.hasCompletedGame = true;
  }

  initiateCakeSequence = () => {
    if (this.userProvidedUsername) {
      this.isEnteringUsername = false;

      // signal start to backend
      this.cakeService.startCakingSequence(this.groupId, this.userProvidedUsername)
      .subscribe(
        (gameToken: string) => {
          this.gameToken = gameToken;
        },
        (err: HttpErrorResponse) => {
          console.log(err);
          this.router.navigate([`/group/${this.groupId}/cake-failure`]);
        }
      );

      this.intervalObj = setInterval(
        () => {
          if (!this.hasCompletedGame) {
            return;
          }
          if (this.cakeingCounter > 1) {
            this.cakeingCounter -= 1;
          }
          else {
            // signal end to backend
            this.cakeService.createCakeEvent(this.gameToken)
              .subscribe(
                () => {
                  this.router.navigate([`/group/${this.groupId}/cake-success`]);
                },
                (err) => {
                  console.log(err);
                  this.router.navigate([`/group/${this.groupId}/cake-failure`]);
                }
              );
              clearInterval(this.intervalObj);
          }
        },
        1050
      );
    }
    else {
      this.errorMessage = 'please provide a name';
    }
  }

  cancelCakeSequence = () => {
    clearInterval(this.intervalObj);
    this.router.navigate([`/group/${this.groupId}/cake-failure`]);
  }

}
