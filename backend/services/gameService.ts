import jwt from 'jsonwebtoken';
import { db } from '../databaseAccess/db';
import { Game, GameMove } from '../models/Game';

const EMPTY = 0;
const COMPUTER = 1;
const PLAYER = 2;


/**
 * generate a JWT-game-token
 * @param game game to use as payload for the token
 */
export function generateGameToken(game: Game) {
	return jwt.sign(game, process.env.JWT_SECRET as string, {expiresIn: '30d'});
}

/**
 * decode a game-token
 * @param gameToken game-token to decode
 */
export function decodeGameToken(gameToken: string): Game | null {
	if (gameToken) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const gamePreProcess: any =  jwt.verify(gameToken, process.env.JWT_SECRET as string);
		delete gamePreProcess.exp;
		delete gamePreProcess.iat;
		return gamePreProcess;

	}
	else {
		return null;
	}
}

/**
 * check if an id is unused (to avoid duplicates)
 * @param gameId id to check
 */
export function checkIfGameIdIsFree(gameId: string): Promise<boolean> {
	return new Promise<boolean>((resolve, reject) => {
		db.all('SELECT * FROM cakeEvents WHERE gameId = ?', gameId,(err, rows) => {
			if (err) {
				reject(err);
			}
			else if (rows.length > 0) {
				resolve(false);
			}
			else if (rows.length === 0) {
				resolve(true);
			}
			else {
				// should not happen
				reject(500);
			}
		}
		);
	});
}


/**
 * generate next game move
 */
export function playNextMove(game: Game): Game {

	const board = getBoardFromGame(game);

	const tmp = getBestNextMove(board, false);

	game.moves.push(tmp.move);
	
	return game;
}

function getBestNextMove(board: number[][], playersMove: boolean): EvaluatedGameMove {
	let bestMove: GameMove | null = null;
	let bestEvalNum: number| null = null;

	for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
		for (let colIndex = 0; colIndex < 3; colIndex++) {
			if (board[rowIndex][colIndex] === EMPTY) {
				const currentMove: GameMove = {row: rowIndex, column: colIndex};
				let currentEvaluation: number;
				const boardCopy = JSON.parse(JSON.stringify(board)) as number[][];

				boardCopy[rowIndex][colIndex] = playersMove? PLAYER:COMPUTER;

				if (checkIfBoardHasWinner(boardCopy) !== null) {
					currentEvaluation = playersMove? -1 : 1;
				}
				else {
					currentEvaluation = getBestNextMove(boardCopy, !playersMove).eval;
				}

				if (bestEvalNum === null) {
					bestMove = currentMove;
					bestEvalNum = currentEvaluation;
				}
				else if (playersMove && currentEvaluation < bestEvalNum) {
					bestMove = currentMove;
					bestEvalNum = currentEvaluation;
				}
				else if (!playersMove && currentEvaluation > bestEvalNum) {
					bestMove = currentMove;
					bestEvalNum = currentEvaluation;
				}
			}
			else {
				continue;
			}
		}
	}
	
	if (bestEvalNum === null || bestMove === null) {
		return {
			move: {row: -1, column: -1},
			eval: 0
		};
	}
	else {
		return {
			move: bestMove,
			eval: bestEvalNum
		};
	}
}

interface EvaluatedGameMove {
	move: GameMove,
	eval: number
}

function getBoardFromGame(game: Game): number[][] {
	// initialize empty board
	const board: number[][] = [];
	for (let i = 0; i < 3; i++) {
		board.push([]);
		for (let j = 0; j < 3; j++)
			board[i].push(EMPTY);
	}

	// fill with moves
	let turn = PLAYER;
	for (const move of game.moves) {
		board[move.row][move.column] = turn;
		if (turn === PLAYER)
			turn = COMPUTER;
		else if (turn === COMPUTER)
			turn = PLAYER;
	}
	return board;
}

function checkIfBoardHasWinner(board: number[][]): boolean | null {
	// check rows
	for (const row of board) {
		if (row.every((item) => item === row[0])){
			if (row[0] === COMPUTER){
				return false;
			}
			else if (row[0] === PLAYER) {
				return true;
			}
		}
	}
	// check cols
	for (const colIndex in board) {
		let isEqual = true;
		for (const rowIndex in board) {
			if (board[rowIndex][colIndex] !== board[0][colIndex]) {
				isEqual = false;
				break;
			}
		}
		if (isEqual && board[0][colIndex] === COMPUTER) {
			return false;
		}
		else if (isEqual && board[0][colIndex] === PLAYER) {
			return true;
		}
	}

	// check diagonals
	if (board[0][0] === board[1][1] 
		&& board[0][0] === board[2][2]) {
		if (board[0][0] === COMPUTER) {
			return false;
		}
		else if (board[0][0] === PLAYER) {
			return true;
		}
	}	
	if (board[0][2] === board[1][1] 
		&& board[2][0] === board[1][1]) {
		if (board[1][1] === COMPUTER) {
			return false;
		}
		else if (board[1][1] === PLAYER) {
			return true;
		}
	}

	return null;
}

export function getWinner(game: Game): boolean | null {
	return checkIfBoardHasWinner(getBoardFromGame(game));	
}


export function fieldIsOccupied(game: Game, field: GameMove): boolean {
	for (const registeredMove of game.moves) {
		if (registeredMove.column === field.column && registeredMove.row === field.row)
			return true;
	}
	return false;
}
