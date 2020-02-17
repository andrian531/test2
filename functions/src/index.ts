import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

/*var serviceAccount = require("../../key.json");
// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wicked2-test.firebaseio.com"
});*/
admin.initializeApp(); 

import { routesVehicle } from './vehicle/router';
const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));
routesVehicle(app)

export const api = functions.https.onRequest(app);