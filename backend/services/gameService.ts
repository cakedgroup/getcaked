import jwt from 'jsonwebtoken';
import { db } from '../databaseAccess/db';
import { Game } from '../models/Game';

export function generateGameToken(game: Game) {
	return jwt.sign(game, process.env.JWT_SECRET as string, {expiresIn: '30d'});
}

export function decodeGameToken(gameToken: string): Game {
	return jwt.verify(gameToken, process.env.JWT_SECRET as string) as Game; 
}

export function checkIfGameIdIsFree(gameId: string): Promise<boolean> {
	return new Promise<boolean>((resolve, reject) => {
		db.all(
			'SELECT * FROM cakeEvents WHERE gameId = ?',
			gameId,
			(err, rows) => {
				if (err) {
					reject(err);
				}
				else if (rows.length > 0) {
					resolve(false);
				}
				else if (rows.length === 0) {
					resolve(true);
				}
				else {
					// should not happen
					reject(500);
				}
			}
		);
	});
}
