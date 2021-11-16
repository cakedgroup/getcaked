import express from 'express';
import {User} from "../models/User";
import {createToken, login} from "../services/authService";

const router = express.Router();

router.post('/', (req: express.Request, res: express.Response) => {
    let username: string = req.body.username as string;
    let password: string = req.body.password as string;

    if (username && password) {
        login(username, password).then((user: User) => {
            let token = createToken(user);
            res.status(200);
            res.json({jwt: token});
        }).catch((err) => {
            console.log(err);
            res.status(404);
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

module.exports = router;
