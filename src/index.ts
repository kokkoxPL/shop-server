import 'dotenv/config';
import express, { Express } from 'express';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';

import userRoutes from './user/route';

const app: Express = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(compression());

app.get('/test', (req, res) => res.sendStatus(200));

app.use('/api/user', userRoutes);

app.listen(process.env.PORT);
