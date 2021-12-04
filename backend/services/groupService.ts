import {db} from '../databaseAccess/db';
import {v4 as uuidv4} from 'uuid';
import {Group, GroupType} from '../models/Group';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

/**
 * function to fetch all Groups and their associated data from the DB
 */
export async function getAllGroups(): Promise<Array<Group>> {
	return new Promise<Array<Group>>((resolve, reject) => {
		const groupArray: Array<Group> = new Array<Group>();
		db.each('SELECT groupId, groupName, type, adminId FROM groups', [], function (err, row) {
			if (err) {
				reject(err);
			}
			else {
				groupArray.push({groupId: row.groupId, groupName: row.groupName, type: row.type, adminId: row.adminId});
			}
		}, () => {
			// only call resolve when query ends
			resolve(groupArray);
		});
	});
}

/**
 * create a new Group with a given name and type, administered by the creating User
 * @param groupName Group's Name
 * @param type Type of Group
 * @param adminId Id of the creating User (which will become the admin of the Group)
 */
export async function createNewGroup(groupName: string, type: GroupType, adminId: string): Promise<Group> {
	const group: Group = {groupId: uuidv4(), groupName: groupName, type: type, adminId: adminId};

	return new Promise<Group>((resolve, reject) => {
		/*
		the FOREIGN KEY constraint should (SHOULD) save my ass right here, if not,
		add 'IF EXISTS (SELECT * FROM users WHERE userId = ?)'
		(without quotes and with the adminId added to the end of the parameter list (again))
		*/
		db.run('INSERT INTO groups(groupId, groupName, type, adminId) VALUES (?, ?, ?, ?);',
			[group.groupId, group.groupName, group.type, group.adminId], function (err) {
				if (err) {
					if (err.toString().match(/^Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed.*$/)) {
						reject(400);
					}
					else if (err.toString().match(/^Error: SQLITE_CONSTRAINT: UNIQUE constraint failed.*$/)) {
						reject(409);
					}
					else {
						console.log(new Error('Error while inserting new Group into the database: ' + err));
						reject(err);
					}
				}
				else if (this.changes === 0) {
					reject(400);
				}
				else {
					addUserToGroup(group.adminId, group.groupId)
						.then(() => {
							resolve(group);
						})
						.catch((err) => {
							reject(err);
						});
				}
			});
			
	});
}

export function addUserToGroup(userId: string, groupId: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		db.run('INSERT INTO members(userId, groupId) VALUES (?, ?);', [userId, groupId], (err) => {
			if (err?.toString().match(/^Error: SQLITE_CONSTRAINT: UNIQUE constraint failed.*$/)) {
				reject(409);
			}
			else if (err) {
				reject(err);
			}
			else {
				resolve();
			}
		});
	});
}

export function removeUserFromGroup(userId: string, groupId: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		db.run('DELETE FROM members WHERE userId = ? AND groupId = ?;', [userId, groupId], (err) => {
			if (err) {
				reject(err);
			}
			else {
				resolve();
			}
		});
	});
}

/**
 *
 * @param groupId
 */
export function deleteGroup(groupId: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		db.run('DELETE FROM members WHERE groupId = ?;', 
			groupId, 
			(err) => {
				if (err) 
					reject(err);
				else
					db.run('DELETE FROM groups WHERE groupId = ?', groupId, (err) => {
						if (err) 
							reject(err);
						else
							resolve();
					});
			});
	});
}

export function getGroupAdmin(groupId: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		db.all('SELECT adminId FROM groups WHERE groupId = ?', groupId, (err, rows) => {
			if (err) {
				reject(err);
			}
			else if (!rows[0]) {
				reject(404);
			}
			else {
				resolve(rows[0]['adminId']);
			}
		});
	});
}

export function getSingleGroup(groupId: string, userId?: string): Promise<Group> {
	return new Promise<Group>((resolve, reject) => {
		db.all(`SELECT groupName, type, adminId 
					FROM groups
					LEFT JOIN members ON groups.groupId = members.groupId
					WHERE groups.groupId = ? AND (type IN ('public', 'private') OR userId = ?);`, 
		[groupId, userId], (err, rows) => {

			if (err) {
				reject(err);
			}
			else if (!rows[0]) {
				reject(404);
			}
			else {
				const group: Group = {
					groupId: groupId,
					groupName: rows[0]['groupName'],
					type: rows[0]['type'],
					adminId: rows[0]['adminId']
				};
				resolve(group);
			}
		});
	});
}

export function getUsersOfGroup(groupId: string): Promise<User[]> {
	return new Promise<User[]>((resolve, reject) => {
		db.all(`SELECT DESTINCT user.userId, username
					FROM user JOIN members ON user.userId = members.userId
					WHERE groupId = ?;`, groupId, (err, rows) => {
			if (err) {
				reject(err);
			}
			else {
				const users: User[] = [];
				rows.forEach((val) => {
					users.push({userId: val['userId'], username: val['username']});
				});
				resolve(users);
			}
		});
	});
}

export function generateInviteToken(groupId: string): string {
	return jwt.sign({groupId: groupId}, process.env.JWT_SECRET as string, {expiresIn: '30d'});
}

export function inviteTokenIsValid(inviteToken: string, groupId: string): boolean {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (jwt.verify(inviteToken, process.env.JWT_SECRET as string) as any).groupId === groupId;
}
