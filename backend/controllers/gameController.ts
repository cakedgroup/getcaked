import express from 'express';
import { getUserAuth } from '../util/authMiddleware';
import { Game } from '../models/Game';
import {v4 as uuidv4} from 'uuid';
import { generateGameToken } from '../services/gameService';
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
			console.log(group);
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
				res.send({game: game, gameToken: generateGameToken(game)});
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

export {router as gameRouter};
