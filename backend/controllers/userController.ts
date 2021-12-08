import express from 'express';
import {User} from '../models/User';
import {changeUserInfo, deleteUser, getCakeEventsOfUser, getUserInfo, registerNewUser} from '../services/userService';
import {createToken} from '../services/authService';
import {getUserAuth} from '../util/authMiddleware';
import {CakeEvent} from '../models/Cake';

const router = express.Router();

/**
 * Create new User
 */
router.post('/', (req: express.Request, res: express.Response) => {
	const username: string = req.body.username;
	const password: string = req.body.password;

	if (username && password) {
		registerNewUser(username, password).then((u: User) => {
			res.status(201);
			res.json({userId: u.userId, jwt: createToken({userId: u.userId, username: u.username})});
		}).catch((err) => {
			if (err === 409) {
				res.status(409);
			}
			else {
				console.log(err);
				res.status(500);
			}
			res.send();
		});
	}
	else {
		const missingParams = new Array<string>();
		if (!username) missingParams.push('username');
		if (!password) missingParams.push('password');
		res.status(400);
		res.send({missingParameters: missingParams});
	}
});

/**
 * get Info of one specific User
 */
router.get('/:userId', (req: express.Request, res: express.Response) => {
	const userId: string = req.params.userId;
	getUserInfo(userId).then((u: User) => {
		res.status(200);
		res.json({userId: u.userId, username: u.username});
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
});

/**
 * change Info of the given User
 */
router.patch('/:userId', getUserAuth, (req: express.Request, res: express.Response) => {
	if (req.decoded && req.decoded.userId === req.params.userId) {
		const username: string = req.body.username;
		const password: string = req.body.password;

		const neededParameters = ['username', 'password'];

		if (username || password) {
			changeUserInfo(req.decoded.userId, username, password).then((user: User) => {
				res.status(200);
				res.json(user);
			}).catch((err) => {
				if (err === 400) {
					res.status(400);
					res.json({missingParameters: neededParameters});
				}
				else if (err === 404) {
					res.status(404);
					res.send();
				}
				else if (err === 409) {
					res.status(409);
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
			res.status(400);
			res.json({missingParameters: neededParameters});
		}
	}
	else {
		res.status(403);
		res.send();
	}
});

/**
 * remove the given User from the db
 */
router.delete('/:userId', getUserAuth, (req: express.Request, res: express.Response) => {
	if (req.decoded && req.decoded.userId === req.params.userId) {
		deleteUser(req.decoded.userId).then(() => {
			res.status(204);
			res.send();
		}).catch((err) => {
			if (err === 404) {
				res.status(404);
				res.send();
			}
			else {
				res.status(409);
				res.send();
			}
		});
	}
	else {
		res.status(403);
		res.send();
	}
});


router.get('/:userId/cakeEvents', getUserAuth, (req: express.Request, res: express.Response) => {
	const userId = req.params.userId;

	if (req.decoded && req.decoded.userId === userId) {
		getCakeEventsOfUser(userId).then((cakeEvents: CakeEvent[]) => {
			res.status(200);
			res.json(cakeEvents);
		}).catch((err) => {
			console.log(err);
			res.status(500);
			res.send();
		});
	}
	else {
		res.status(403);
		res.send();
	}
});

export {router as userRouter};
