import { AcademicSubject } from "./Subject";

export interface Student {
    uid: string,
    name: string,
    email: string,
    phone: string,
    birthDate?: string,
    address?: string,
    subject: AcademicSubject;
    professor: string,
    role: string
}