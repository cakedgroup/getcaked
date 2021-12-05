/* eslint-disable indent */
/* eslint-disable no-empty */
import express from 'express';
import { getUserAuth } from '../util/authMiddleware';
import { Game } from '../models/Game';
import {v4 as uuidv4} from 'uuid';
import { generateGameToken } from '../services/gameService';

const router = express.Router();

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

    console.log(game.userId);
});

export {router as gameRouter};
