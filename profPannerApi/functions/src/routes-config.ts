import {Application} from "express";
import {isAuthenticated} from "./auth/authenticated";
import {isAuthorized} from "./auth/authorized";
import {create, all, get, patch, remove} from "./users/user.controller";
import {
  createLesson,
  getById,
  update,
  removeLesson,
  getAllLessonsByUser} from "./lessons/lesson.controller";
import {
  createStudent,
  getStudentAllByUser,
  getStudentById,
  updateStudent,
  removeStudent} from "./students/student.controller";
import {
  createLessonNote,
  getLessonNotesByLesson,
  getLessonNoteById,
  removeLessonNote,
  updateLessonNote} from "./lesson_notes/lesson_notes.controller";

export function routesConfig(app: Application) {
  app.post("/users",
      isAuthorized({hasRole: ["admin", "manager"]}),
      create,
  );
  // lists all users
  app.get("/users", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"]}),
    all,
  ]);
  // get :id user
  app.get("/users/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"], allowSameUser: true}),
    get,
  ]);
  // updates :id user
  app.patch("/users/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"], allowSameUser: true}),
    patch,
  ]);
  // deletes :id user
  app.delete("/users/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"]}),
    remove,
  ]);

  app.post("/lessons",
      isAuthenticated,
      isAuthorized({hasRole: ["admin", "manager"]}),
      createLesson,
  );
  // lists all lessons
  app.get("/lessons/:userId", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"]}),
    getAllLessonsByUser,
  ]);
  // get :id lesson
  app.get("/lessons/details/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"]}),
    getById,
  ]);
  // updates :id lesson
  app.patch("/lessons/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"], allowSameUser: true}),
    update,
  ]);
  // deletes :id lesson
  app.delete("/lessons/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"]}),
    removeLesson,
  ]);

  app.post("/students",
      isAuthenticated,
      isAuthorized({hasRole: ["admin", "manager"]}),
      createStudent,
  );
  // lists all students
  app.get("/students/:userId", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"]}),
    getStudentAllByUser,
  ]);
  // get :id student
  app.get("/students/student/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"], allowSameUser: true}),
    getStudentById,
  ]);
  // updates :id student
  app.patch("/students/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"], allowSameUser: true}),
    updateStudent,
  ]);
  // deletes :id student
  app.delete("/students/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"]}),
    removeStudent,
  ]);

  app.post("/lessonNotes",
      isAuthenticated,
      isAuthorized({hasRole: ["admin", "manager"]}),
      createLessonNote,
  );
  // lists all students
  app.get("/lessonNotes/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"]}),
    getLessonNotesByLesson,
  ]);
  // get :id student
  app.get("/lessonNotes/note/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"], allowSameUser: true}),
    getLessonNoteById,
  ]);
  // updates :id student
  app.patch("/lessonNotes/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"], allowSameUser: true}),
    updateLessonNote,
  ]);
  // deletes :id student
  app.delete("/lessonNotes/:id", [
    isAuthenticated,
    isAuthorized({hasRole: ["admin", "manager"]}),
    removeLessonNote,
  ]);
}
