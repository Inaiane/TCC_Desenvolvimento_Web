import {Request, Response} from "express";
import {db} from "../config/firebaseConfig.js";

const collectionName = "students";

export async function getStudentAll(req: Request, res: Response) {
  try {
    const studentQuerySnapshot = await db.collection(collectionName).get();
    const students: any = [];
    studentQuerySnapshot.forEach((doc: any) => {
      students.push({...doc.data(), uid: doc.id});
    });
    const studentResp = {students: students};
    return res.status(200).json(studentResp);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function getStudentAllByUser(req: Request, res: Response) {
  const userId = req.params.userId;
  try {
    const studentQuerySnapshot = await db.collection(collectionName)
        .where("professor", "==", userId)
        .get();
    const students: any = [];
    studentQuerySnapshot.forEach((doc: any) => {
      students.push({...doc.data(), uid: doc.id});
    });
    const result = {students: students};
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function getStudentById(req: Request, res: Response) {
  const studentId = req.params.id;
  try {
    const result = await db.collection(collectionName).doc(studentId).get();
    const student = result.data();
    return res.status(200).json(student);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function createStudent(req: Request, res: Response) {
  const studentData = req && req.body ? req.body : [];
  try {
    await db.collection(collectionName).add(studentData);
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function updateStudent(req: Request, res: Response) {
  const studentId = req.params.id;
  const studentData = req && req.body ? req.body : [];
  try {
    await db.collection(collectionName).doc(studentId)
        .set(studentData, {merge: true});
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function removeStudent(req: Request, res: Response) {
  const studentId = req.params.id;
  try {
    await db.collection(collectionName).doc(studentId).delete();
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

