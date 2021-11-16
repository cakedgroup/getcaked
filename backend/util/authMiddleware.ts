import express from "express";
import jwt from "jsonwebtoken";
import {User} from "../models/User";



export function getUserAuth (req: express.Request, res: express.Response, next: express.NextFunction) {
    let token: string | undefined = req.header('Authorization');
    if (token) {
        req.decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User;
    }
    next();
}
