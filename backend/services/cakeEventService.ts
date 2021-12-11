import { db } from '../databaseAccess/db';
import { CakeEvent } from '../models/Cake';

export async function createCakeEvent(cakeEvent: CakeEvent) {
	return new Promise<void>((resolve, reject) => {
		if (cakeEvent.username === null) {
			reject(new Error('no Username given'));
		}
		else db.run(`INSERT INTO cakeEvents (cakeId, timestamp, username, cakeDelivered, userId, groupId, gameId) 
				VALUES (?, ?, ?, ?, ?, ?, ?)`,
		[
			cakeEvent.cakeId, 
			cakeEvent.timeStamp, 
			cakeEvent.username, 
			cakeEvent.cakeDelivered, 
			cakeEvent.cakeVictimId, 
			cakeEvent.groupId,
			cakeEvent.gameId
		],
		(err) => {
			if (err) {
				reject(err);
			}
			else {
				resolve();
			}
		});
	});
}

export function getCakeEvent(cakeId: string) {
	return new Promise<CakeEvent>((resolve, reject) => {
		db.get('SELECT * FROM cakeEvents WHERE cakeId = ?', cakeId, (err, row) => {
			if (err)
				reject(err);
			else if (row){
				const cakeEvent: CakeEvent = {
					cakeId: row['cakeId'],
					timeStamp: row['timestamp'],
					cakeVictimId: row['userId'],
					username: row['username'],
					cakeDelivered: row['cakeDelivered'],
					groupId: row['groupId'],
					gameId: row['gameId']
				};
				resolve(cakeEvent);
			}
			else
				reject();
		});
	});
}

export function changeStatusOfCakeEvent(isDelivered: boolean, cakeId: string) {
	return new Promise<void>((resolve, reject) => {
		db.run('UPDATE cakeEvents SET cakeDelivered = ? WHERE cakeId = ?', 
			[isDelivered, cakeId],
			(err) => {
				if (err)
					reject(err);
				else 
					resolve();
			}
		);
	});
}
