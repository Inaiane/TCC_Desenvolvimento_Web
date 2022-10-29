import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import * as bodyParser from "body-parser";
import {routesConfig} from "./routes-config";

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: true}));
routesConfig(app);

export const api = functions.https.onRequest(app);
