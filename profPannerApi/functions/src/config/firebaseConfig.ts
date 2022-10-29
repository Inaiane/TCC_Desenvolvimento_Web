import * as admin from "firebase-admin";
import {ServiceAccount} from "firebase-admin";
import * as serviceAccountKey from "./serviceAccountKey.json";

const serviceAccount = serviceAccountKey as ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://profplanner-e8ca0.firebaseio.com",
});

const db = admin.firestore();
db.settings({ignoreUndefinedProperties: true});

export {admin, db};
