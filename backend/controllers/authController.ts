import express from 'express';
import {User} from '../models/User';
import {createToken, login} from '../services/authService';

const router = express.Router();

/**
 * Handle login-requests (authorize Users)
 */
router.post('/', (req: express.Request, res: express.Response) => {
	const username: string = req.body.username;
	const password: string = req.body.password;

	if (username && password) {
		login(username, password).then((user: User) => {
			const token = createToken(user);
			res.status(200);
			res.json({userId: user.userId, jwt: token});
		}).catch(() => {
			res.status(403);
			res.send();
		});
	}
	else {
		const missingParams = new Array<string>();
		if (!username) missingParams.push('username');
		if (!password) missingParams.push('password');
		res.status(400);
		res.send({missingParameter: missingParams});
	}
});

export {router as authRouter};
