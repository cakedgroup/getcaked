import express from 'express';
import {Group, GroupType} from '../models/Group';
import {createNewGroup, deleteGroup, getAllGroups, getGroupAdmin, getSingleGroup} from '../services/groupService';
import {getUserAuth} from '../util/authMiddleware';

const router = express.Router();

/**
 * fetch data of all groups
 */
router.get('/', (req: express.Request, res: express.Response) => {
	getAllGroups().then((groups: Array<Group>) => {
		res.status(200);
		res.json(groups);
	}).catch(() => {
		res.status(500);
		res.send();
	});
});

/**
 * add a new group
 */
router.post('/', getUserAuth, (req: express.Request, res: express.Response) => {
	if (req.decoded && req.decoded.userId) {
		const groupName: string = req.body.groupName;
		const type: GroupType = req.body.type;
		if (groupName && type && Object.values(GroupType).includes(type)) {
			createNewGroup(groupName, type, req.decoded.userId).then((group: Group) => {
				res.status(201);
				res.json(group);
			}).catch((err) => {
				if (typeof err === 'number') {
					res.status(err);
				}
				else {
					console.log(err);
					res.status(500);
				}
				res.send();
			});
		}
		else {
			const missingParameters = new Array<string>();
			if (!groupName) missingParameters.push('groupName');
			if (!type) missingParameters.push('type');

			const invalidParameters = new Array<string>();
			if(!Object.values(GroupType).includes(type)) invalidParameters.push('type');

			/*
			this following object initialization is really nice:
			it basically says initialize an empty object which will take
			an arbitrary number (array brackets) of string-type keys with string-arrays as their values
			*/
			const json: {[key: string]: Array<string>} = {};
			if (missingParameters) json.missingParameters = missingParameters;
			if (invalidParameters) json.invalidParameters = invalidParameters;
			res.status(400);
			res.json(json);
		}
	}
	else {
		res.status(403);
		res.send();
	}
});

/**
 * delete a group
 */

router.delete('/:groupId', getUserAuth, async (req: express.Request, res: express.Response) => {
	const groupId: string = req.params.groupId;

	// TODO: evaluate if order of checks makes sense from a sec perspective
	if (groupId === '') {
		res.status(400);
		res.send({missingParameters: ['groupId']});
	}
	else try {
		const adminId: string = await getGroupAdmin(groupId);

		if (req.decoded && req.decoded.userId && req.decoded.userId === adminId) {
			deleteGroup(groupId).then(() => {
				res.status(204);
				res.send();
			}).catch((err) => {
				if (typeof err === 'number') {
					res.status(err);
				}
				else {
					console.log(err);
					res.status(500);
				}
				res.send();
			});
		}
		else {
			res.status(403);
			res.send();
		}
	}
	catch (err) {
		if (err === 400) {
			res.status(400);
			res.json({error: 'please check if the column you are accessing exists'});
		}
		else {
			console.log(err);
			res.status(500);
			res.send();
		}
	}
});

router.get('/:groupId', getUserAuth, (req: express.Request, res: express.Response) => {
	const groupId: string = req.params.groupId;
	let groupPromise: Promise<Group>;

	if (req.decoded && req.decoded.userId)
		groupPromise = getSingleGroup(groupId, req.decoded.userId);
	else
		groupPromise = getSingleGroup(groupId);

	groupPromise
		.then((group) => {
			res.status(200);
			res.send(group);
		})
		.catch((err) => {
			if (err === 404) {
				res.status(404);
				res.send();
			}
			else {
				console.log(err);
				res.status(500);
				res.send();
			}
		});
});

export {router as groupRouter};
