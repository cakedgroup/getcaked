import express from 'express';
import jwt from 'jsonwebtoken';
import {User} from '../models/User';

/**
 * Decode the JWT-Token given in the Authorization header, while verifying its integrity
 * @param req Request-Object
 * @param res Response-Object
 * @param next NextFunction-Call
 */
export function getUserAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
	const token: string | undefined = req.header('Authorization');
	if (token) {
		req.decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User;
	}
	next();
}
