import {Request, Response} from "express";
import * as admin from "firebase-admin";
import {db} from "../config/firebaseConfig.js";

export async function create(req: Request, res: Response) {
  console.log("request");
  console.log(req.body);
  try {
    const {displayName, password, email, role, subjects} = req.body;

    if (!displayName || !password || !email || !role) {
      return res.status(400).send({message: "Missing fields"});
    }

    const {uid} = await admin.auth().createUser({
      displayName,
      password,
      email,
    });

    await db.collection("users").doc(uid)
        .set({uid, displayName, email, role, subjects});
    await admin.auth().setCustomUserClaims(uid, {role});

    return res.status(201).send({uid});
  } catch (err) {
    return handleError(res, err);
  }
}

export async function all(req: Request, res: Response) {
  try {
    const listUsers = await admin.auth().listUsers();
    const users = listUsers.users.map(mapUser);
    return res.status(200).json({users});
  } catch (err) {
    return handleError(res, err);
  }
}

function mapUser(user: admin.auth.UserRecord) {
  const customClaims = (user.customClaims || {role: ""}) as { role?: string };
  const role = customClaims.role ? customClaims.role : "";
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
    role,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
  };
}

export async function get(req: Request, res: Response) {
  console.log("get user");
  console.log(req.body);
  try {
    const {id} = req.params;
    // const user = await admin.auth().getUser(id);
    const user = await db.collection("users").doc(id).get();
    const userData = {"user": user.data()};
    return res.status(200).json(userData);
  } catch (err) {
    return handleError(res, err);
  }
}

export async function patch(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const {displayName, password, email, role} = req.body;
    const data = req.body;

    if (!id || !displayName || !password || !email || !role) {
      return res.status(400).send({message: "Missing fields"});
    }

    await admin.auth().updateUser(id, {displayName, password, email});
    await admin.auth().setCustomUserClaims(id, {role});
    await db.collection("users")
        .doc(id).set(data, {merge: true});
    const user = await admin.auth().getUser(id);
    return res.status(204).send({user: mapUser(user)});
  } catch (err) {
    return handleError(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const {id} = req.params;
    await admin.auth().deleteUser(id);
    await db.collection("users").doc(id).delete();
    return res.status(204).send();
  } catch (err) {
    return handleError(res, err);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(res: Response, err: any) {
  return res.status(500).send({message: `${err.code} - ${err.message}`});
}
