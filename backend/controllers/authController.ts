import express from 'express';
import {User} from '../models/User';
import {createToken, login} from '../services/authService';

const router = express.Router();

router.post('/', (req: express.Request, res: express.Response) => {
	const username: string = req.body.username as string;
	const password: string = req.body.password as string;

	if (username && password) {
		login(username, password).then((user: User) => {
			const token = createToken(user);
			res.status(200);
			res.json({userId: user.userId, jwt: token});
		}).catch((err) => {
			console.log(err);
			res.status(404);
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
