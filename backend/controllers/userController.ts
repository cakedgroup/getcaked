import express from "express";
import {User} from "../models/User";
import {registerNewUser} from "../services/userService";

const router = express.Router();

router.post('/', (req, res) =>{
    let username: string = req.body.username;
    let password: string = req.body.password;

    if (username && password) {
        registerNewUser(username, password).then((u: User) => {
            res.status(201);
            res.json({userId: u.userId});
        }).catch((err) => {
            if (err === 19) {
                res.status(409);
            }
            else {
                res.status(500);
            }
            res.send();
        })
    }
    else {
        res.status(400);
        res.send();
    }
})

router.get('/:userId', (req, res) => {

})

module.exports = router;
