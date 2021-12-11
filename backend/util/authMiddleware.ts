import express from 'express';
import jwt from 'jsonwebtoken';
import {User} from '../models/User';
import { getUserInfo } from '../services/userService';

/**
 * Decode the JWT-Token given in the Authorization header, while verifying its integrity
 * @param req Request-Object
 * @param res Response-Object
 * @param next NextFunction-Call
 */
export function getUserAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
	const token: string | undefined = req.header('Authorization');
	if (token) {
		try {
			req.decoded = jwt.verify(token, process.env.JWT_SECRET as string, {algorithms: ['HS256']}) as User;
			// check if user actually exists
			getUserInfo(req.decoded.userId).then(() => {
				next();
			}).catch(() => {
				res.status(403);
				res.send();
			} );
		}
		catch (err) {
			req.decoded = undefined; // jwt couldn't be decoded -> handle, as if none was given
			next();
		}
	} 
	else {
		next();
	}
}
