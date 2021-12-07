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
