import { db } from '../databaseAccess/db';
import { CakeEvent } from '../models/Cake';

export function createCakeEvent(cakeEvent: CakeEvent) {
	return new Promise<void>((resolve, reject) => {
		db.run(
			`INSERT INTO cakeEvents (cakeId, timestamp, username, cakeDelivered, userId, groupId, gameId) 
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
			}
		);
	});
}
