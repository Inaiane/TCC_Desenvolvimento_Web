import { AcademicSubject } from "./Subject";

export type Role = 'admin' | 'manager' | 'user';

export interface User {
    uid: string;
    displayName: string;
    lastName?: string;
    email: string;
    photoURL?: string;
    phoneNumber?: string;
    birthDate?: string;
    cep?: string;
    address?: string;
    subjects: Array<AcademicSubject>;
    role?: Role;
}