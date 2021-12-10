import express from 'express';
import { CakeEvent } from '../models/Cake';
import {Group, GroupType} from '../models/Group';
// eslint-disable-next-line max-len
import {
	addUserToGroup,
	changeGroupInfo,
	checkIfUserHasAccessToGroup,
	createNewGroup,
	deleteGroup,
	generateInviteToken,
	getAllGroups,
	getCakeEventsOfGroup,
	getGroupAdmin,
	getSingleGroup,
	getUsersOfGroup,
	inviteTokenIsValid,
	removeUserFromGroup
} from '../services/groupService';
import {getUserAuth} from '../util/authMiddleware';
import { getMissingOrInvalidParameters } from '../util/general';

const router = express.Router();

/**
 * fetch data of all groups
 */
router.get('/', getUserAuth, (req: express.Request, res: express.Response) => {
	const searchQuery = req.query.search?.toString();
	getAllGroups(req.decoded?.userId, searchQuery).then((groups: Array<Group>) => {
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
		console.log(type);

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
			const invalidParameters = new Array<string>();
			if(!Object.values(GroupType).includes(type)) invalidParameters.push('type');

			res.status(400);
			res.json(getMissingOrInvalidParameters(
				[
					{val: groupName, paramName: 'groupname'},
					{val: type, paramName: 'type'}
				],
				invalidParameters
			));
		}
	}
	else {
		res.status(403);
		res.send();
	}
});

/**
 * change Infos of a group
 */
router.patch('/:groupId', getUserAuth, (req: express.Request, res: express.Response) => {
	const groupName = req.body.groupName;
	const type = req.body.type;
	console.log(type);
	const groupId = req.params.groupId;

	if (!groupName && !type && !Object.values(GroupType).includes(type)) {
		res.status(400);
		res.send();
	}
	else if (groupId) {
		getGroupAdmin(groupId).then((adminId: string) => {
			if (req.decoded && req.decoded.userId && req.decoded.userId === adminId) {
				changeGroupInfo(groupId, groupName, type).then( () => {
					res.status(204);
					res.send();
				}).catch( (err) => {
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
		}).catch((err) => {
			if (err === 400 || err === 404) {
				res.status(err);
				res.send();
			}
			else {
				console.log(err);
				res.status(500);
				res.send();
			}
		});
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
		if (err === 404) {
			res.status(err);
			res.json({error: 'please check if the column you are accessing exists'});
		}
		else {
			console.log(err);
			res.status(500);
			res.send();
		}
	}
});

/**
 * get infos of one specific group
 */
router.get('/:groupId', getUserAuth, (req: express.Request, res: express.Response) => {
	const groupId: string = req.params.groupId;

	getSingleGroup(groupId, req.decoded?.userId).then((group) => {
		res.status(200);
		res.send(group);
	}).catch((err) => {
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

/**
 * add a user to a group (covers both invite tokens and adding by admins)
 */
router.post('/:groupId/users', getUserAuth, (req: express.Request, res: express.Response) => {
	const groupId: string = req.params.groupId;
	const userId: string = req.body.userId;
	const invitetoken: string = req.body.invitetoken;

	if (groupId && req.decoded && req.decoded.userId) {
		getGroupAdmin(groupId).then((adminId: string) => {
			if (req.decoded?.userId === adminId // case 1: user is admin
				|| (req.decoded?.userId === userId  // case 2: user has invite token
					&& inviteTokenIsValid(invitetoken, groupId))) {
				addUserToGroup(userId, groupId).then(() => {
					res.status(201);
					res.send();
				}).catch((err) => {
					if (err === 409)
						res.status(409);
					// should not be reachable
					else
						res.status(500);
					res.send();
				});
			} 
			else {
				res.status(403);
				res.send();
			}
		}).catch((err) => {
			if (err === 400 || err === 404) {
				res.status(err);
				res.send();
			}
			else {
				console.log(err);
				res.status(500);
				res.send();
			}
		});
	}
	else {
		// user needs to be logged in in both cases
		res.status(403);
		res.send();
	}
});

/**
 * Remove user from a group (both by the user themselve or an admin)
 */
router.delete('/:groupId/users/:userId', getUserAuth, (req: express.Request, res: express.Response) => {
	const groupId: string = req.params.groupId;
	const userId: string = req.params.userId;

	if (!req.decoded || !req.decoded.userId) {
		res.status(403);
		res.send();
		return;
	}
	if (groupId && userId) {
		getGroupAdmin(groupId).then((adminId: string) => {
			if ((req.decoded?.userId === adminId && userId != adminId) || (req.decoded?.userId === userId)) {
				removeUserFromGroup(userId, groupId).then(() => {
					res.status(204);
					res.send();
				}).catch(() => {
					res.status(400);
					res.send();
				});
			} 
			else {
				res.status(403);
				res.send();
			}
		}).catch((err) => {
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
		res.send(getMissingOrInvalidParameters(
			[
				{val: groupId, paramName: 'groupId'},
				{val: userId, paramName: 'userId'}
			]
		));
	}
});

/**
 * get the members of a group
 */
router.get('/:groupId/users', getUserAuth, (req: express.Request, res: express.Response) => {
	const groupId: string = req.params.groupId;
	checkIfUserHasAccessToGroup(groupId, req.decoded?.userId).then((hasAccess) => {
		if (hasAccess) {
			getUsersOfGroup(groupId).then((users) => {
				res.status(200);
				res.send(users);
			}).catch(() => {
				// validation should have caught everything
				res.status(500);
				res.send();
			});
		}
		else {
			// a user not having access and it not existing have to be handled in the same way
			res.status(404);
			res.send();
		}
	}).catch(() => {
		res.status(500);
		res.send();
	});
	
});

/**
 * Generate an invite token
 */
router.get('/:groupId/invitetoken', getUserAuth, (req: express.Request, res: express.Response) => {
	const groupId: string = req.params.groupId;

	if (groupId && req.decoded && req.decoded.userId) {
		getGroupAdmin(groupId).then((adminId: string) => {
			if (req.decoded && req.decoded.userId === adminId) {
				res.status(200);
				res.send({invitetoken: generateInviteToken(groupId)});
			} 
			else {
				res.status(403);
				res.send();
			}
		}).catch((err) => {
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

/**
 * check for cakeEvents
 */
router.get('/:groupId/cakeEvents', getUserAuth, async (req: express.Request, res: express.Response) => {
	const groupId: string = req.params.groupId;
	
	try {
		if (await checkIfUserHasAccessToGroup(groupId, req.decoded?.userId)) {
			getCakeEventsOfGroup(groupId).then((cakeEvents: CakeEvent[]) => {
				res.status(200);
				res.send(cakeEvents);
			}).catch(() => {
				// all errors should have been caught to this point
				res.status(500);
				res.send();
			});
		}
		else {
			// 404 because no access to a group and not found are handled the same
			res.status(404);
			res.send();
		}
	} 
	catch (error) {
		res.status(500);
		res.send();
	}
});

export {router as groupRouter};
