import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable } from 'rxjs';
import { Lesson } from '../models/Lesson';
import { Student } from '../models/Student';

export type CreateLessonRequest = {
    description: string,
    subject: string,
    student: Student,
    duration: number,
    cost: number,
    lessonDate: string,
    professor: string,
    role: 'admin'
  };
export type UpdateLessonRequest = { uid: string } & CreateLessonRequest;

@Injectable({
  providedIn: 'root'
})
export class LessonsService {

  private baseUrl = 'http://localhost:5001/profplanner-e8ca0/us-central1/api/lessons'

  constructor(
    private http: HttpClient,
    public afAuth: AngularFireAuth
  ) { }


  get lessons(): Observable<Lesson[]> {
    return this.http.get<{ lessons: Lesson[] }>(`${this.baseUrl}`).pipe(
      map(result => {
        return result.lessons;
      })
    );
  }

  lessonsByUser(userId: string): Observable<Lesson[]> {
    return this.http.get<{ lessons: Lesson[] }>(`${this.baseUrl}/${userId}`).pipe(
      map(result => {
        return result.lessons;
      })
    );
  }

  lesson(id: string): Observable<Lesson> {
    return this.http.get<{ lesson: Lesson }>(`${this.baseUrl}/details/${id}`).pipe(
      map(result => {
        return result.lesson;
      })
    );
  }

  create(lesson: CreateLessonRequest) {
    return this.http.post(`${this.baseUrl}`, lesson).pipe(
      map(_ => { })
    );
  }

  edit(lesson: Lesson) {
    return this.http.patch(`${this.baseUrl}/${lesson.uid}`, lesson).pipe(
      map(_ => { })
    );
  }

  remove(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      map(result => {
        return result;
      })
    );
  }
}
