import {Request, Response} from "express";
import {db} from "../config/firebaseConfig.js";

const collectionName = "lessons";

export async function getAll(req: Request, res: Response) {
  try {
    const lessonQuerySnapshot = await db.collection(collectionName).get();
    const lessons: any = [];
    lessonQuerySnapshot.forEach((doc: any) => {
      lessons.push({...doc.data(), uid: doc.id});
    });
    const lessonsResp = {lessons: lessons};
    return res.status(200).json(lessonsResp);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function getById(req: Request, res: Response) {
  const lessonId = req.params.id;
  try {
    const result = await db.collection(collectionName).doc(lessonId).get();
    const lesson = {lesson: result.data()};
    return res.status(200).json(lesson);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function getAllLessonsByUser(req: Request, res: Response) {
  const userId = req.params.userId;
  try {
    const lessonQuerySnapshot = await db.collection(collectionName)
        .where("professor", "==", userId)
        .get();
    const lessons: any = [];

    lessonQuerySnapshot.forEach((doc: any) => {
      lessons.push({...doc.data(), uid: doc.id});
    });
    const result = {lessons: lessons};
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function createLesson(req: Request, res: Response) {
  const lessonData = req && req.body ? req.body : [];
  try {
    await db.collection(collectionName).add(lessonData);
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function update(req: Request, res: Response) {
  const lessonId = req.params.id;
  const lessonData = req && req.body ? req.body : [];
  try {
    await db.collection(collectionName).doc(lessonId)
        .set(lessonData, {merge: true});
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function removeLesson(req: Request, res: Response) {
  const lessonId = req.params.id;
  try {
    await db.collection(collectionName).doc(lessonId).delete();
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

