import 'dotenv/config';
import express, { Express } from 'express';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import cors from 'cors';

import userRoutes from './users/routes';
import productRoutes from './products/routes';

const app: Express = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(cors);
app.use(compression());

app.get('/', (req, res) => res.sendStatus(200));

app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);

app.listen(process.env.PORT);
