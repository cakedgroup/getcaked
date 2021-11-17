import jwt from 'jsonwebtoken';
import {User} from '../models/User';
import crypto from 'crypto';
import {db} from '../databaseAccess/db';

export function createToken(user: User): string {
	return jwt.sign(user, process.env.JWT_SECRET as string, {expiresIn: '30d'});
}

export function login(username: string, password: string): Promise<User> {
	return new Promise((resolve, reject) => {
		db.get('SELECT * FROM users WHERE username = ?', [username], function (err, user) {
			if (user) {
				validatePassword(password, user.passwordHash, user.passwordSalt).then((isCorrect: boolean) => {
					if (isCorrect) {
						resolve({userId: user.userId, username: username});
					}
					else {
						reject(403);
					}
				}).catch((err) => {
					reject(err);
				});
			}
			else {
				reject(404);
			}
		});
	});
}

function validatePassword(password: string, passwordHash: string, usedSalt: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		crypto.scrypt(password, usedSalt, 128, (err, derivedKey) => {
			if (err) {
				reject(err);
			}
			resolve(passwordHash === derivedKey.toString('hex'));
		});
	});
}
