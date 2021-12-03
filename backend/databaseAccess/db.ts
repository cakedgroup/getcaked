import sqlite from 'sqlite3';

/**
 * SQLite Database Connection used to interact with the Database
 */
export const db = new sqlite.Database('./databases/getcaked.db', (err) => {
	if (err) {
		console.log(err);
	}
	else {
		console.log('Established connection to database');
		createTables();
	}
});

/**
 * function to create Tables if they don't already exist
 */
function createTables(): void {
	db.run('PRAGMA foreign_keys = ON', (err) => {
		if (err) {
			console.log(err);
		}
	});
	db.run(`CREATE TABLE IF NOT EXISTS users(
                userId TEXT PRIMARY KEY NOT NULL, 
                username TEXT NOT NULL UNIQUE, 
                passwordSalt TEXT NOT NULL,
                passwordHash TEXT NOT NULL
            );`, (err) => {
		if (err) {
			console.log('1. Run' + err);
		}
	});
	db.run(`CREATE TABLE IF NOT EXISTS groups(
                groupId TEXT PRIMARY KEY NOT NULL, 
                groupName TEXT NOT NULL, 
                type TEXT NOT NULL, 
                adminId TEXT NOT NULL, 
                FOREIGN KEY (adminId) REFERENCES users(userId)
            );`, (err) => {
		if (err) {
			console.log('2. Run' + err);
		}
	});
	db.run(`CREATE TABLE IF NOT EXISTS cakeEvents(
                cakeId TEXT PRIMARY KEY NOT NULL, 
                timestamp DATE NOT NULL, 
                username TEXT NOT NULL, 
                cakeDelivered INTEGER NOT NULL, 
                userId TEXT, 
                groupId TEXT NOT NULL, 
                FOREIGN KEY (userId) REFERENCES users(userId),
                FOREIGN KEY (groupId) REFERENCES groups(groupId)
            );`, (err) => {
		if (err) {
			console.log('3. Run' + err);
		}
	});
	db.run(`CREATE TABLE IF NOT EXISTS members(
                userId TEXT NOT NULL, 
                groupId TEXT NOT NULL, 
                FOREIGN KEY (userId) REFERENCES users(userId), 
                FOREIGN KEY (groupId) REFERENCES groups(groupId), 
                PRIMARY KEY (userId, groupId)
            );`, (err) => {
		if (err) {
			console.log('4. Run' + err);
		}
	});
}
