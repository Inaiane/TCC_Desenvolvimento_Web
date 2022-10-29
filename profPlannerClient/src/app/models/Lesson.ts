import { Student } from "./Student";
import { AcademicSubject } from "./Subject";

export interface Lesson {
    uid: string,
    description: string,
    subject: AcademicSubject,
    student: Student,
    duration: number,
    cost: number,
    eventDate: string,
    professor: string,
    role: string
}