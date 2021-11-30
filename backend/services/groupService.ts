import {db} from '../databaseAccess/db';
import {v4 as uuidv4} from 'uuid';
import {Group, GroupType} from '../models/Group';

/**
 * function to fetch all Groups and their associated data from the DB
 */
export async function getAllGroups(): Promise<Array<Group>> {
	return new Promise((resolve, reject) => {
		const groupArray: Array<Group> = new Array<Group>();
		db.each('SELECT groupId, groupName, type, adminId FROM groups', [], function (err, row) {
			if (err) {
				reject(err);
			}
			else {
				groupArray.push({groupId: row.groupId, groupName: row.groupName, type: row.type, adminId: row.adminId});
			}
		});
		if (groupArray.length > 0) {
			resolve(groupArray);
		}
		else {
			reject(404);
		}
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

	return new Promise((resolve, reject) => {
		/*
		the FOREIGN KEY constraint should (SHOULD) save my ass right here, if not,
		add 'IF EXISTS (SELECT * FROM users WHERE userId = ?)'
		(without quotes and with the adminId added to the end of the parameter list (again))
		*/
		db.run('INSERT INTO groups(groupId, groupName, type, adminId) VALUES (?, ?, ?, ?)',
			[group.groupId, group.groupName, group.type, group.adminId], function (err) {
				if (err) {
					if (err.toString().match(/^Error: SQLITE_CONSTRAINT: FOREIGN KEY constraint failed.*$/)) {
						reject(404);
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
					reject(404);
				}
				else {
					resolve(group);
				}
			});
	});
}
