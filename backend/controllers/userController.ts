import express from "express";
import {User} from "../models/User";
import {registerNewUser} from "../services/userService";

const router = express.Router();

router.post('/', (req, res) =>{
    let username: string = req.body.username;
    let password: string = req.body.password;

    console.log(username);
    console.log(password);

    registerNewUser(username, password).then((u: User) => {
        res.status(201);
        res.json(u);
    }).catch((err) => {
        console.log(err);
        res.status(500);
        res.send();
    })
})

module.exports = router;
