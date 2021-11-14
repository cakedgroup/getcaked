import { db } from "../databaseAccess/db";
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';
import { User } from "../models/User";

export async function registerNewUser(username: string, password: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
        let hashInfos: any = await hashPassword(password).catch((err) => {
            reject(new Error("Error while hashing password: " + err));
        });

        let u : User = new User(uuidv4(), username, hashInfos.passwordHash);

        db.run(`INSERT INTO users(userId, username, passwordSalt, passwordHash) VALUES (?, ?, ?, ?)`,
            [u.userId, u.username, hashInfos.salt, u.passwordHash], function (err: any) {
                if (err) {
                    if (err.toString().match(/^Error: SQLITE_CONSTRAINT: UNIQUE constraint failed.*$/)) { // constraint failed
                        reject(19);
                    }
                    reject(new Error("Error while inserting new User into the database: " + err));
                }
                else {
                    resolve(u);
                }
            }
        );
    })
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

function validatePassword(password: string, passwordHash: string, usedSalt: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password, usedSalt, 128, (err, derivedKey) => {
            if (err) {
                reject (err);
            }
            resolve (passwordHash === derivedKey.toString('hex'));
        })
    })
}