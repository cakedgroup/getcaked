import {db} from '../databaseAccess/db';
import {v4 as uuidv4} from 'uuid';
import * as crypto from 'crypto';
import {User} from '../models/User';

/**
 * General interface providing a minimal format for hashInfos
 */
interface hashInfos {
	salt: string,
	passwordHash: string
}

/**
 * register a new User with the given Username, authorized by the given Password
 * @param username User's (nick-)name
 * @param password User's password
 */
export async function registerNewUser(username: string, password: string): Promise<User> {
	const hashInfos: hashInfos = await hashPassword(password).catch((err) => {
		throw(new Error('Error while hashing password: ' + err));
	});

	const u: User = {userId: uuidv4(), username: username};

	return new Promise((resolve, reject) => {
		db.run('INSERT INTO users(userId, username, passwordSalt, passwordHash) VALUES (?, ?, ?, ?)',
			[u.userId, u.username, hashInfos.salt, hashInfos.passwordHash], function (err) {
				if (err) {
					// eslint-disable-next-line max-len
					if (err.toString().match(/^Error: SQLITE_CONSTRAINT: UNIQUE constraint failed.*$/)) { // constraint failed
						reject(409);
					}
					else {
						console.log(err);
						reject(new Error('Error while inserting new User into the database: ' + err));
					}
				}
				else {
					resolve(u);
				}
			}
		);
	});
}

/**
 * Fetch Info a specific User
 * @param userId userId specifying, which User's info shall be fetched
 */
export function getUserInfo(userId: string): Promise<User> {
	return new Promise((resolve, reject) => {
		db.get('SELECT username FROM users WHERE userId = ?', [userId], function (err, user) {
			if (user) {
				resolve({userId: userId, username: user.username});
			}
			else {
				reject(404);
			}
		});
	});
}

/**
 * Change the User's info
 * @param userId Id of the User, who's info shall be edited
 * @param username new Username
 * @param password new Password
 */
export async function changeUserInfo(userId: string, username: string | null, password: string | null): Promise<User> {
	if (!username && !password) {
		throw(400);
	}
	else {
		let sql = 'UPDATE users SET';
		const params: Array<string> = [];
		if (username) {
			sql += ' username = ?';
			params.push(username);
			if (password) sql += ',';
		}
		if (password) {
			const hashInfos: hashInfos = await hashPassword(password).catch((err) => {
				throw(new Error('Error while hashing password: ' + err));
			});
			sql += ' passwordSalt = ?, passwordHash = ?';
			params.push(hashInfos.salt);
			params.push(hashInfos.passwordHash);
		}
		sql += 'WHERE userId = ?';
		params.push(userId);
		return new Promise((resolve, reject) => {
			db.run(sql, params, function (err) {
				if (err) {
					// eslint-disable-next-line max-len
					if (err.toString().match(/^Error: SQLITE_CONSTRAINT: UNIQUE constraint failed.*$/)) { // constraint failed
						reject(409);
					}
					else {
						console.log(err);
						reject(new Error('Error while updating user infos: ' + err));
					}
				}
				else if (this.changes === 0) {
					reject(404);
				}
				else {
					return getUserInfo(userId).then((user: User) => {
						resolve(user);
					}).catch((err) => {
						reject(err);
					});
				}
			});
		});

	}
}

/**
 * delete one User
 * @param userId ID identifying the User to be deleted
 */
export async function deleteUser(userId: string): Promise<void> {
	return new Promise((resolve, reject) => {
		db.run('DELETE FROM users WHERE userId = ?', [userId], function (err) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else if (this.changes === 0) {
				reject(404);
			}
			else {
				resolve();
			}
		});
	});
}

/**
 * function to hash the password with a random salt (returns both hashed password and the used Salt)
 * @param password password to be hashed
 */
function hashPassword(password: string): Promise<hashInfos> {
	return new Promise((resolve, reject) => {
		const salt = crypto.randomBytes(128).toString('base64');
		crypto.scrypt(password, salt, 128, (err, derivedKey) => {
			if (err) {
				reject(err);
			}
			const passwordHash = derivedKey.toString('hex');
			resolve({
				salt: salt,
				passwordHash: passwordHash
			});
		});
	});
}
