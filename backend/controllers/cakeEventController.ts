import express from 'express';
import { CakeEvent } from '../models/Cake';
import { Game } from '../models/Game';
import { checkIfGameIdIsFree, decodeGameToken, getWinner } from '../services/gameService';
import { getUserAuth } from '../util/authMiddleware';
import {v4 as uuidv4} from 'uuid';
import { changeStatusOfCakeEvent, createCakeEvent, getCakeEvent } from '../services/cakeEventService';
import {getUserInfo} from '../services/userService';
import { getGroupAdmin } from '../services/groupService';

const router = express.Router();

/**
 * creates a cake-event
 */
router.post('/', getUserAuth, async (req: express.Request, res: express.Response) => {
	const gameToken = req.body.gameToken;
	const game: Game | null = decodeGameToken(gameToken);

	if (game && game.userId && req.decoded && req.decoded.userId && game.username === undefined) {
		game.username = (await getUserInfo(game.userId)).username;
	}
	if (game && game.username) {
		if (Date.now() - game.startTime >= 30000) {
			if (game.userId && getWinner(game) === false) {
				res.status(400);
				res.send({error: 'game has not been completed'});
				return;
			}
			try {
				if (await checkIfGameIdIsFree(game.gameId)) {
					const cakeEvent: CakeEvent = {
						cakeId: uuidv4(),
						timeStamp: new Date(),
						cakeVictimId: req.decoded?.userId,
						username: game.username,
						cakeDelivered: false,
						groupId: game.groupId,
						gameId: game.gameId
					};
					createCakeEvent(cakeEvent).then(() => {
						res.status(201);
						res.send();
					}).catch(() => {
						// validation should have caught everything up to this point
						res.status(500);
						res.send();
					});
				}
				else {
					res.status(409);
					res.send({conflictError: 'this game has already been completed'});
				}
				
			} 
			catch (error) {
				// should not occur due to validation in the prev. lines
				res.status(500);
				res.send();
			}
		}
		else {
			res.status(403);
			res.send({timeError: 'not enough time has passed'});
		}
	}
	else {
		res.status(403);
		res.send({authError: 'authentification failed'});
	}
});

/**
 * used to close a cake-event
 */

router.patch('/:cakeId', getUserAuth, (req: express.Request, res: express.Response) => {
	const cakeId = req.params.cakeId;
	const cakeDelivered: boolean = req.body.cakeDelivered;

	if (cakeDelivered === undefined) {
		res.status(400);
		res.send({missingParameters: ['cakeDelivered']});
	}

	if (req.decoded && req.decoded.userId) {
		getCakeEvent(cakeId).then((cakeEvent) => {
			getGroupAdmin(cakeEvent.groupId).then((adminId: string) => {
				if (adminId === req.decoded?.userId) {
					changeStatusOfCakeEvent(cakeDelivered, cakeId).then(() => {
						res.status(204);
						res.send();
					}).catch(() => {
						res.status(500);
						res.send();
					});
				}
				else {
					res.status(403);
					res.send();
				}
			});
		}).catch(() => {
			res.status(404);
			res.send();
		});
	}
	else {
		res.status(403);
		res.send();
	}
});

export {router as cakeEventRouter};
