import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CakeService } from 'src/app/core/services/cake.service';
import { Game, GameResponse } from 'src/app/models/game.model';

const EMPTY = '-';
const PLAYER = 'X';
const COMPUTER = 'O';

@Component({
  selector: 'app-cake-game',
  templateUrl: './cake-game.component.html',
  styleUrls: ['./cake-game.component.css']
})
export class CakeGameComponent implements OnInit {

  @Input() gameToken: string;
  @Output() gameTokenChanges = new EventEmitter<string>();
  @Output() gameStatusChanges = new EventEmitter<boolean>();

  board: string[][] = [];
  hasLost: boolean = false;
  errorMessage: string;

  constructor(
    private cakeService: CakeService
  ) { }

  ngOnInit(): void {
    for (let i = 0; i < 3; i++) {
      this.board.push([]);
      for (let j = 0; j < 3; j++)
        this.board[i].push(EMPTY);
    }
  }

  playMove(row: number, col: number) {
    if (this.board[row][col] === EMPTY && !this.hasLost) {
      this.board[row][col] = PLAYER;
      this.cakeService.playGameMove({
        row: row,
        column: col
      }, this.gameToken).subscribe(
        (response: GameResponse) => {
          this.redrawBoard(response.game);
          this.gameToken = response.gameToken;
          if (response.won) {
            this.gameTokenChanges.emit(this.gameToken);
            this.gameStatusChanges.emit(true);
          }
          else if (response.won === false) {
            this.hasLost = true;
          }
        },
        (err: HttpErrorResponse) => {
          this.errorMessage = 'Game move failed with error: ' + err.status;
        }
      );
    }
  }

  redrawBoard(game: Game) {
    let turn = PLAYER;
    for (const move of game.moves) {
      this.board[move.row][move.column] = turn;
      if (turn === PLAYER)
        turn = COMPUTER;
      else if (turn === COMPUTER)
        turn = PLAYER
    }
  }

}
