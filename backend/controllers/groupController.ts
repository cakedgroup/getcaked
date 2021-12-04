import express from 'express';
import {Group, GroupType} from '../models/Group';
// eslint-disable-next-line max-len
import {addUserToGroup, createNewGroup, deleteGroup, generateInviteToken, getAllGroups, getGroupAdmin, getSingleGroup, getUsersOfGroup, inviteTokenIsValid, removeUserFromGroup} from '../services/groupService';
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

router.post('/:groupId/users', getUserAuth, (req: express.Request, res: express.Response) => {
	const groupId: string = req.params.groupId;
	const userId: string = req.body.userId;
	const invitetoken: string = req.body.invitetoken;

	if (groupId && req.decoded && req.decoded.userId) {
		getGroupAdmin(groupId)
			.then((adminId: string) => {
				if (req.decoded?.userId === adminId 
					|| (req.decoded?.userId === userId && inviteTokenIsValid(invitetoken, groupId))) {
					addUserToGroup(userId, groupId)
						.then(() => {
							res.status(201);
							res.send();
						})
						.catch((err) => {
							if (err === 409)
								res.status(409);
							else
								res.status(400);
							res.send();
						});
				} 
				else {
					res.status(403);
					res.send();
				}
			})
			.catch((err) => {
				if (err === 400) {
					res.status(400);
					res.send();
				}
				else {
					res.status(500);
					res.send();
				}
			});
	}
	else {
		res.status(400);
		res.send();
	}
});

router.delete('/:groupId/users/:userId', getUserAuth, (req: express.Request, res: express.Response) => {
	const groupId: string = req.params.groupId;
	const userId: string = req.params.userId;

	if (groupId && userId && req.decoded && req.decoded.userId) {
		getGroupAdmin(groupId)
			.then((adminId: string) => {
				if ((req.decoded?.userId === adminId && userId != adminId) || (req.decoded?.userId === userId)) {
					removeUserFromGroup(userId, groupId)
						.then(() => {
							res.status(204);
							res.send();
						})
						.catch(() => {
							res.status(400);
							res.send();
						});
				} 
				else {
					res.status(403);
					res.send();
				}
			})
			.catch((err) => {
				if (err === 400) {
					res.status(400);
					res.send();
				}
				else {
					res.status(500);
					res.send();
				}
			});
	}
	else {

		const missingParameters = new Array<string>();
		if (!groupId) missingParameters.push('groupName');
		if (!userId) missingParameters.push('type');

		if (missingParameters.length === 0) {
			res.status(403);
			res.send();
		}
		else {
			res.status(400);
			res.send({missingParameters: missingParameters});
		}
	}
});

router.get('/:groupId/users', getUserAuth, (req: express.Request, res: express.Response) => {
	const groupId: string = req.params.groupId;
	// TODO: add propper check if group exists..
	getUsersOfGroup(groupId)
		.then((users) => {
			res.status(200);
			res.send(users);
		})
		.catch(() => {
			res.status(404);
			res.send();
		});
});

router.get('/:groupId/invitetoken', getUserAuth, (req: express.Request, res: express.Response) => {
	const groupId: string = req.params.groupId;

	if (groupId && req.decoded && req.decoded.userId) {
		getGroupAdmin(groupId)
			.then((adminId: string) => {
				if (req.decoded && req.decoded.userId === adminId) {
					res.status(200);
					res.send({invitetoken: generateInviteToken(groupId)});
				} 
				else {
					res.status(403);
					res.send();
				}
			})
			.catch((err) => {
				if (err === 404) {
					res.status(404);
					res.send();
				}
				else {
					res.status(500);
					res.send();
				}
			});
	}
	else {
		res.status(400);
		res.send();
	}
});

export {router as groupRouter};
