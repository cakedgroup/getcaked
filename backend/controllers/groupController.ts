import express from 'express';
import {Group} from '../models/Group';
import {getAllGroups} from '../services/groupService';

const router = express.Router();

/**
 * fetch data of all groups
 */
router.get('/', (req: express.Request, res: express.Response) => {
	getAllGroups().then((groups: Array<Group>) => {
		res.status(200);
		res.json(groups);
	}).catch((err) => {
		if (err === 404) {
			res.status(404);
		}
		else {
			res.status(500);
		}
		res.send();
	});
});

export {router as groupRouter};
