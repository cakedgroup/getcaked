import express from 'express';
import * as logger from './util/logger';
import cors from 'cors';

import {groupRouter} from './controllers/groupController';
import {userRouter} from './controllers/userController';
import {authRouter} from './controllers/authController';

const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(logger.logToConsole);

router.use('/groups', groupRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);

router.use((_req: express.Request, res: express.Response) => {
	res.status(404);
	res.send('Route does not exist');
});

export {router as apiRouter};
