import {User} from '../models/User';

declare module 'express' {
	interface Request {
		decoded?: User;
	}
}
