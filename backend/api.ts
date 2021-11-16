import express from 'express';
import * as logger from './util/logger';
import cors from 'cors';
const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(logger.logToConsole);

router.use('/groups', require('./controllers/groupController'));
router.use('/users', require('./controllers/userController'));
router.use('/auth', require('./controllers/authController'));

router.use((_req: express.Request, res: express.Response) => {
  res.status(404);
  res.send('Route does not exist');
});

export { router as apiRouter };
