import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable } from 'rxjs';
import { Student } from '../models/Student';

export type CreateStudentRequest = { displayName: string, password: string, email: string, role: string };
export type UpdateStudentRequest = { uid: string } & CreateStudentRequest;

@Injectable({
  providedIn: 'root'
})

export class StudentsService {

  private baseUrl = 'http://localhost:5001/profplanner-e8ca0/us-central1/api/students'

  constructor(
    private http: HttpClient,
    public afAuth: AngularFireAuth
  ) { }

  get students(): Observable<Student[]> {
    return this.http.get<{ students: Student[] }>(`${this.baseUrl}`).pipe(
      map(result => {
        return result.students;
      })
    );
  }

  studentsByUser(userId: string): Observable<Student[]> {
    return this.http.get<{ students: Student[] }>(`${this.baseUrl}/${userId}`).pipe(
      map(result => {
        return result.students;
      })
    );
  }

  student(id: string): Observable<Student> {
    return this.http.get<{ student: Student }>(`${this.baseUrl}/${id}`).pipe(
      map(result => {
        return result.student;
      })
    );
  }

  create(student: Student) {
    return this.http.post(`${this.baseUrl}`, student).pipe(
      map(_ => { })
    );
  }

  edit(student: Student) {
    return this.http.patch(`${this.baseUrl}/${student.uid}`, student).pipe(
      map(_ => { })
    );
  }

  remove(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      map(_ => { })
    );
  }
}
