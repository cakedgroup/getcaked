import express from 'express';
import { CakeEvent } from '../models/Cake';
import { Game } from '../models/Game';
import { checkIfGameIdIsFree, decodeGameToken } from '../services/gameService';
import { getUserAuth } from '../util/authMiddleware';
import {v4 as uuidv4} from 'uuid';
import { createCakeEvent } from '../services/cakeEventService';

const router = express.Router();

/**
 * creates a cake-event
 */
router.post('/', getUserAuth, async (req: express.Request, res: express.Response) => {
	const gameToken = req.body.gameToken;
	const game: Game = decodeGameToken(gameToken);

	if ((game.userId && req.decoded && req.decoded.userId) || game.username) {
		console.log(Date.now() - game.startTime, Date.now(), game.startTime);
		if (Date.now() - game.startTime >= 30000) {
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

export {router as cakeEventRouter};
