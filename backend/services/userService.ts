import {db} from '../databaseAccess/db';
import {v4 as uuidv4} from 'uuid';
import * as crypto from 'crypto';
import {User} from '../models/User';
import {CakeEvent} from '../models/Cake';

/**
 * General interface providing a minimal format for HashInfos
 */
interface HashInfos {
	salt: string,
	passwordHash: string
}

/**
 * register a new User with the given Username, authorized by the given Password
 * @param username User's (nick-)name
 * @param password User's password
 */
export async function registerNewUser(username: string, password: string): Promise<User> {
	const hashInfos: HashInfos = await hashPassword(password).catch((err) => {
		throw(new Error('Error while hashing password: ' + err));
	});

	const u: User = {userId: uuidv4(), username: username};

	return new Promise<User>((resolve, reject) => {
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
	return new Promise<User>((resolve, reject) => {
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
			const hashInfos: HashInfos = await hashPassword(password).catch((err) => {
				throw(new Error('Error while hashing password: ' + err));
			});
			sql += ' passwordSalt = ?, passwordHash = ?';
			params.push(hashInfos.salt);
			params.push(hashInfos.passwordHash);
		}
		sql += 'WHERE userId = ?';
		params.push(userId);
		return new Promise<User>((resolve, reject) => {
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
	return new Promise<void>((resolve, reject) => {
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
 * get list of cake-events of a user ordered by newest first
 * @param userId id of the user
 */
export async function getCakeEventsOfUser(userId: string): Promise<CakeEvent[]> {
	return new Promise<CakeEvent[]>((resolve, reject) => {
		db.all('SELECT * from cakeEvents WHERE userId = ? ORDER BY timestamp DESC', userId, (err, rows) => {
			if (err) {
				reject(err);
			}
			else {
				const cakeEvents: CakeEvent[] = [];
				for (const row of rows) {
					cakeEvents.push({
						cakeId: row['cakeId'] as string,
						timeStamp: row['timestamp'] as Date,
						cakeVictimId: row['userId'] as string | undefined,
						username: row['username'] as string | undefined,
						cakeDelivered: row['cakeDelivered'] as boolean,
						groupId: row['groupId'] as string,
						gameId: row['gameId'] as string
					});
				}
				resolve(cakeEvents);
			}
		});
	});
}

/**
 * function to hash the password with a random salt (returns both hashed password and the used Salt)
 * @param password password to be hashed
 */
function hashPassword(password: string): Promise<HashInfos> {
	return new Promise<HashInfos>((resolve, reject) => {
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
