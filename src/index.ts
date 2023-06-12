import "dotenv/config";
import express, { Express } from "express";
import compression from "compression";
import { json, urlencoded } from "body-parser";


import routes from "./route";

const app: Express = express();

app.use(urlencoded({ extended: false }));
app.use(json());
app.use(compression());

app.use("/api", routes);

app.listen(process.env.PORT);