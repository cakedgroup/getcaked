import express from 'express';
import * as logger from './util/logger';
import cors from 'cors';

import {groupRouter} from './controllers/groupController';
import {userRouter} from './controllers/userController';
import {authRouter} from './controllers/authController';
import {gameRouter} from './controllers/gameController';
import { cakeEventRouter } from './controllers/cakeEventController';

const router = express.Router();

/**
 * specifying generally used middlewares
 */
router.use(cors());
router.use(express.json());
router.use(logger.logToConsole);

/**
 * Routes handled by their respective controllers
 */
router.use('/groups', groupRouter);
router.use('/games', gameRouter);
router.use('/cakeEvents', cakeEventRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);

/**
 * Respond with 404, when invalid Route is accessed
 */
router.use((_req: express.Request, res: express.Response) => {
	res.status(404);
	res.send('Route does not exist');
});

export {router as apiRouter};
