import {Request, Response} from "express";
import {db} from "../config/firebaseConfig.js";

const collectionName = "lesson_notes";

export async function createLessonNote(req: Request, res: Response) {
  const lessonNoteData = req && req.body ? req.body : [];
  try {
    await db.collection(collectionName).add(lessonNoteData);
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function getAllLessonNotes(req: Request, res: Response) {
  try {
    const lessonPlanQuerySnapshot = await db.collection(collectionName).get();
    const lessonNotes: any = [];
    lessonPlanQuerySnapshot.forEach((doc: any) => {
      lessonNotes.push({...doc.data(), uid: doc.id});
    });
    const resp = {lessonNotes: lessonNotes};
    return res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function getLessonNotesByLesson(req: Request, res: Response) {
  const lessonId = req.params.id;
  try {
    const lessonPlanQuerySnapshot = await db.collection(collectionName)
        .where("lessonId", "==", lessonId)
        .get();
    const lessonNotes: any = [];
    lessonPlanQuerySnapshot.forEach((doc: any) => {
      lessonNotes.push({...doc.data(), uid: doc.id});
    });
    const resp = {lessonNotes: lessonNotes};
    return res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function getLessonNoteById(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const result = await db.collection(collectionName).doc(id).get();
    const resp = {lessonNote: result.data()};
    return res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function updateLessonNote(req: Request, res: Response) {
  const id = req.params.id;
  const lessonNoteData = req && req.body ? req.body : [];
  try {
    await db.collection(collectionName).doc(id)
        .set(lessonNoteData, {merge: true});
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}

export async function removeLessonNote(req: Request, res: Response) {
  const id = req.params.id;
  try {
    await db.collection(collectionName).doc(id).delete();
    return res.status(200).send();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
}
