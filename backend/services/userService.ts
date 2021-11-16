import { db } from "../databaseAccess/db";
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { User } from "../models/User";

export async function registerNewUser(username: string, password: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
        let hashInfos: any = await hashPassword(password).catch((err) => {
            reject(new Error("Error while hashing password: " + err));
        });

        let u : User = {userId: uuidv4(), username: username};

        db.run(`INSERT INTO users(userId, username, passwordSalt, passwordHash) VALUES (?, ?, ?, ?)`,
            [u.userId, u.username, hashInfos.salt, hashInfos.passwordHash], function (err) {
            if (err) {
                if (err.toString().match(/^Error: SQLITE_CONSTRAINT: UNIQUE constraint failed.*$/)) { // constraint failed
                    reject(409);
                }
                else {
                    console.log(err);
                    reject(new Error("Error while inserting new User into the database: " + err));
                }
            }
            else {
                resolve(u);
            }
        });
    });
}

export async function getUserInfo(userId: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
        db.get(`SELECT username FROM users WHERE userId = ?`, [userId], function (err, user) {
            if (user) {
                resolve({userId: userId, username: user.username});
            }
            else {
                reject(404);
            }
        });
    });
}

export async function changeUserInfo(userId: string, username: string | null, password: string | null): Promise<User> {
    return new Promise(async (resolve, reject) => {
        let sql = `UPDATE users SET`
        let params = [];
        if (!username && !password){
            reject(400);
        }
        else {
            if (username) {
                sql += ` username = ?`;
                params.push(username);
                if (password) sql += `,`;
            }
            if (password) {
                let hashInfos: any = await hashPassword(password).catch((err) => {
                    reject(new Error("Error while hashing password: " + err));
                });
                sql += ` passwordSalt = ?, passwordHash = ?`;
                params.push(hashInfos.salt);
                params.push(hashInfos.passwordHash);
            }
            sql += `WHERE userId = ?`;
            params.push(userId);
            db.run(sql, params, function (err) {
                if (err) {
                    if (err.toString().match(/^Error: SQLITE_CONSTRAINT: UNIQUE constraint failed.*$/)) { // constraint failed
                        reject(409);
                    }
                    else {
                        console.log(err);
                        reject(new Error("Error while inserting new User into the database: " + err));
                    }
                }
                else if (this.changes === 0) {
                    reject(404);
                }
                else {
                    getUserInfo(userId).then((user: User) => {
                        resolve(user);
                    }).catch((err) => {
                        reject(err);
                    })
                }
            });
        }
    });
}

export async function deleteUser(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
       db.run(`DELETE FROM users WHERE userId = ?`, [userId], function (err) {
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

function hashPassword(password: string): Promise<any> {
    return new Promise((resolve, reject) => {
        let salt = crypto.randomBytes(128).toString('base64');
        crypto.scrypt(password, salt, 128, (err, derivedKey) => {
            if (err) {
                reject (err);
            }
            let passwordHash = derivedKey.toString('hex')
            resolve ({
                salt: salt,
                passwordHash: passwordHash
            });
        });
    });
}
