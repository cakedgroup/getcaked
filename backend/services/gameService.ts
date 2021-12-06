import jwt from 'jsonwebtoken';
import { db } from '../databaseAccess/db';
import { Game } from '../models/Game';

/**
 * generate a JWT-game-token
 * @param game game to use as payload for the token
 */
export function generateGameToken(game: Game) {
	return jwt.sign(game, process.env.JWT_SECRET as string, {expiresIn: '30d'});
}

/**
 * decode a game-token
 * @param gameToken game-token to decode
 */
export function decodeGameToken(gameToken: string): Game {
	return jwt.verify(gameToken, process.env.JWT_SECRET as string) as Game; 
}

/**
 * check if an id is unused (to avoid duplicates)
 * @param gameId id to check
 */
export function checkIfGameIdIsFree(gameId: string): Promise<boolean> {
	return new Promise<boolean>((resolve, reject) => {
		db.all('SELECT * FROM cakeEvents WHERE gameId = ?', gameId,(err, rows) => {
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
