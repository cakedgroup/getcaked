import dotenv from 'dotenv';

dotenv.config({path: './config/app.env'});

import express from 'express';
import './util/requestDeclarationMerging';
import path from 'path';
import {apiRouter} from './api';

const app = express();

app.use('/api', apiRouter);

app.use(express.static(process.env.FRONTEND_DIST_PATH as string));
app.use((_req: express.Request, res: express.Response) => {
	res.sendFile(path.join(__dirname, process.env.FRONTEND_DIST_PATH as string, 'index.html'));
});

app.listen(process.env.NODE_PORT, () => {
	console.log(`App listening at http://localhost:${process.env.NODE_PORT}`);
});
