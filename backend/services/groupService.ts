import {db} from '../databaseAccess/db';
import {v4 as uuidv4} from 'uuid';
import {Group, GroupType} from '../models/Group';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { CakeEvent } from '../models/Cake';

/**
 * function to fetch all Groups and their associated data from the DB
 */
export async function getAllGroups(userId?: string): Promise<Array<Group>> {
	return new Promise<Array<Group>>((resolve, reject) => {
		db.all(`SELECT DISTINCT groups.groupId, groupName, type, adminId 
				FROM groups JOIN members ON groups.groupId = members.groupId 
				WHERE userId = ? OR type IN ('public', 'private')`,
		userId, function (err, rows) {
			if (err) {
				console.log(err);
				reject(err);
			}
			else {
				const groupArray: Array<Group> = new Array<Group>();
				for (const row of rows) {
					groupArray.push(
						{groupId: row.groupId, groupName: row.groupName, type: row.type, adminId: row.adminId}
					);
				}
				resolve(groupArray);
			}
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
					addUserToGroup(group.adminId, group.groupId).then(() => {
						resolve(group);
					}).catch((err) => {
						reject(err);
					});
				}
			});
			
	});
}

/**
 * add a new User to a group
 * @param userId id of the user
 * @param groupId id of the group
 */
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

/**
 * remove User from a group
 * @param userId id of the user
 * @param groupId id of the group
 */
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
 * delete a single group
 * @param groupId id of the group
 */
export function deleteGroup(groupId: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		db.run('DELETE FROM members WHERE groupId = ?;', groupId, (err) => {
			if (err) {
				reject(err);
			}
			else {
				db.run('DELETE FROM groups WHERE groupId = ?', groupId, (err) => {
					if (err)
						reject(err);
					else
						resolve();
				});
			}
		});
	});
}

/**
 * get the userId of a group's admin
 * @param groupId id of the group
 */
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

/**
 * get infos on a single group
 * @param groupId id of the group
 * @param userId id of the user (used for privateInvisible groups)
 */
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

/**
 * get member-list of a group
 * @param groupId id of the group
 */
export function getUsersOfGroup(groupId: string): Promise<User[]> {
	return new Promise<User[]>((resolve, reject) => {
		db.all(`SELECT users.userId, username
					FROM users JOIN members ON users.userId = members.userId
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

/**
 * get list of cake-events of a group with the most recent cakeEvent occupying the index 0
 * @param groupId id of the group
 */
export function getCakeEventsOfGroup(groupId: string): Promise<CakeEvent[]> {
	return new Promise<CakeEvent[]>((resolve, reject) => {
		db.all('SELECT * from cakeEvents WHERE groupId = ? ORDER BY timestamp DESC', groupId,(err, rows) => {
			if (err) {
				reject(err);
			}
			else if (rows.length === 0) {
				reject(404);
			}
			else if (rows.length > 0) {
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
			else {
				// should not be a valid branch
				reject(500);
			}
		});
	});
}

/**
 * generate an invite-token for a group
 * @param groupId id of the group
 */
export function generateInviteToken(groupId: string): string {
	return jwt.sign({groupId: groupId}, process.env.JWT_SECRET as string, {expiresIn: '30d'});
}

/**
 * validate invite-token
 * @param inviteToken token to be validated
 * @param groupId id of the group to be checked against
 */
export function inviteTokenIsValid(inviteToken: string, groupId: string): boolean {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (jwt.verify(inviteToken, process.env.JWT_SECRET as string) as any).groupId === groupId;
}

/**
 * check, whether the User has access to the group
 * @param groupId id of the group
 * @param userId id of the user
 */
export function checkIfUserHasAccessToGroup(groupId: string, userId: string | undefined): Promise<boolean> {
	return new Promise<boolean>((resolve, reject) => {
		db.all(`SELECT * FROM groups 
					JOIN members ON groups.groupId = members.groupId 
					WHERE groups.groupId = ? AND (members.userId = ? OR groups.type IN ('public', 'private'))`,
		[ groupId, userId ],(err, rows) => {
			if (err) {
				reject(err);
			}
			else if (rows.length === 0) {
				resolve(false);
			}
			else if (rows.length > 0) {
				resolve(true);
			}
			else {
				// should never occur
				reject(500);
			}
		}
		);
	});
}
