import express from 'express';
import { getUserAuth } from '../util/authMiddleware';
import { Game, GameMove } from '../models/Game';
import {v4 as uuidv4} from 'uuid';
import { decodeGameToken, fieldIsOccupied, generateGameToken, getWinner, playNextMove } from '../services/gameService';
import { checkIfUserIsMemberOfGroup, getSingleGroup } from '../services/groupService';
import { Group, GroupType } from '../models/Group';

const router = express.Router();

/**
 * generate a new game
 */
router.post('/', getUserAuth, (req: express.Request, res: express.Response) => {
	const cakeVictitimName = req.body.cakeVictimName;
	const groupId = req.body.groupId;
	const cakeVictimId = req.decoded?.userId;

	if (!cakeVictimId && !cakeVictitimName || !groupId) {
		const missingParameters: string[] = [];

		if(!cakeVictitimName) missingParameters.push('cakeVictimName');
		if(!groupId) missingParameters.push('groupId');

		res.status(400);
		res.send({missingParameters: missingParameters});
		return;
	}

	getSingleGroup(groupId, cakeVictimId)
		.then( async (group: Group) => {
			if (group.type === GroupType.PUBLIC_GROUP || await checkIfUserIsMemberOfGroup(groupId, cakeVictimId)) {
				const game: Game = {
					gameId: uuidv4(),
					startTime: Date.now(),
					username: cakeVictitimName,
					userId: cakeVictimId,
					groupId: groupId,
					moves: [],
				};
			
				res.status(201);
				res.send({game: game, gameToken: generateGameToken(game), win: null});
			} 
			else {
				res.status(403);
				res.send();
			}
		})
		.catch((err) => {
			if (err === 404){
				res.status(400);
				res.send({invalidGroupError: 'group either doesn\'t exist or you don\'t have access to it'});
			}
			else {
				res.status(500);
				res.send();
			}
		});

});

/**
 * Register a new game move
 */

router.patch('/', getUserAuth, (req: express.Request, res: express.Response) => {
	const gameToken = req.body.gameToken;
	const userMove: GameMove = req.body.move;
	let game: Game | null = decodeGameToken(gameToken);

	if (game && userMove) {
		if (fieldIsOccupied(game, userMove) 
		|| userMove.row > 2 || userMove.column < 0 || userMove.row > 2 || userMove.column < 0) {
			res.status(400);
			res.send({error: 'invalid move'});
		}
		if (req.decoded?.userId && req.decoded.userId === game.userId) {
			game.moves.push(userMove);
			let gameState = 0;
			if (game.moves.length >= 9) {
				res.status(200);
				switch (getWinner(game)) {
				case true:
					gameState = 1;
					break;
				case null:
					gameState = 2;
					break;
				case false:
					gameState = 3;
					break;
				}
				res.send({game: game, gameToken: generateGameToken(game), gameState: gameState});
				return;
			}
			if (getWinner(game) === null) {
				game = playNextMove(game);
				switch (getWinner(game)) {
				case true:
					gameState = 1;
					break;
				case false:
					gameState = 3;
					break;
				}
			}

			res.status(200);
			res.send({game: game, gameToken: generateGameToken(game), gameState: gameState});
		}
		else {
			res.status(403);
			res.send();
		}
	}
	else {
		res.status(400);
		res.send({error: 'missing or malformed gameToken/move'});
	}
});

export {router as gameRouter};
