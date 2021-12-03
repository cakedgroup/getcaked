import jwt from 'jsonwebtoken';
import {User} from '../models/User';
import crypto from 'crypto';
import {db} from '../databaseAccess/db';

/**
 * Creates a JWT-Token for the given User
 * @param user User to be stored in the Token
 */
export function createToken(user: User): string {
	return jwt.sign(user, process.env.JWT_SECRET as string, {expiresIn: '30d'});
}

/**
 * Login-Wrapper to check whether the password is correct for the given User
 * @param username User to be logged in
 * @param password Password the login is attempted with
 */
export function login(username: string, password: string): Promise<User> {
	return new Promise<User>((resolve, reject) => {
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
				reject(403);
			}
		});
	});
}

/**
 * As the name suggests, this function validates a given password against the corresponding passwordHash and usedSalt
 * @param password Password to be verified
 * @param passwordHash PasswordHash to be verified against
 * @param usedSalt Salt used when the given passwordHash was created
 */
function validatePassword(password: string, passwordHash: string, usedSalt: string): Promise<boolean> {
	return new Promise<boolean>((resolve, reject) => {
		crypto.scrypt(password, usedSalt, 128, (err, derivedKey) => {
			if (err) {
				reject(err);
			}
			resolve(passwordHash === derivedKey.toString('hex'));
		});
	});
}
