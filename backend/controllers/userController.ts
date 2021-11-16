import express from "express";
import {User} from "../models/User";
import {getUserInfo, registerNewUser} from "../services/userService";
import {createToken} from "../services/authService";
import {getUserAuth} from "../util/authMiddleware";

const router = express.Router();

router.post('/', (req, res) =>{
    let username: string = req.body.username;
    let password: string = req.body.password;

    if (username && password) {
        registerNewUser(username, password).then((u: User) => {
            res.status(201);
            res.json({jwt: createToken({userId: u.userId, username: u.username})});
        }).catch((err) => {
            if (err === 409) {
                res.status(409);
            }
            else {
                console.log(err);
                res.status(500);
            }
            res.send();
        })
    }
    else {
        let missingParams = new Array<string>();
        if (!username) missingParams.push("username");
        if (!password) missingParams.push("password");
        res.status(400);
        res.send({missingParameter: missingParams});
    }
});

router.get('/:userId', (req, res) => {
    let userId = req.params.userId;
    getUserInfo(userId).then((u: User) => {
        res.status(200);
        res.json({userId: u.userId, username: u.username});
    }).catch((err) => {
        if (err === 404) {
            res.status(404);
            res.send();
        }
        else {
            res.status(500);
            res.send();
        }
    })
});

router.patch('/:userId', getUserAuth,(req: express.Request, res) => {
    if (req.decoded && req.decoded.userId === req.params.userId){
        res.status(200);
        res.send();
    }
    else {
        res.status(403);
        res.send();
    }
});

module.exports = router;
