import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, Observable } from 'rxjs';
import { LessonNote } from '../models/LessonNote';

export type CreateLessonNoteRequest = {
  title: string;
  note: string;
  role: 'admin'
};
export type UpdateLessonNoteRequest = { uid: string } & CreateLessonNoteRequest;

@Injectable({
  providedIn: 'root'
})
export class LessonNotesService {

  private baseUrl = 'http://localhost:5001/profplanner-e8ca0/us-central1/api/lessonNotes'

  constructor(
    private http: HttpClient,
    public afAuth: AngularFireAuth
  ) { }


  get lessonNotes(): Observable<LessonNote[]> {
    return this.http.get<{ lessonNotes: LessonNote[] }>(`${this.baseUrl}`).pipe(
      map(result => {
        return result.lessonNotes;
      })
    );
  }

  lessonNotesByLesson(lessonId: string): Observable<LessonNote[]> {
    return this.http.get<{ lessonNotes: LessonNote[] }>(`${this.baseUrl}/${lessonId}`).pipe(
      map(result => {
        return result.lessonNotes;
      })
    );
  }

  lessonNote(id: string): Observable<LessonNote> {
    return this.http.get<{ lessonNote: LessonNote }>(`${this.baseUrl}/note/${id}`).pipe(
      map(result => {
        return result.lessonNote;
      })
    );
  }

  create(lessonNote: CreateLessonNoteRequest) {
    return this.http.post(`${this.baseUrl}`, lessonNote).pipe(
      map(_ => { })
    );
  }

  edit(lessonNote: UpdateLessonNoteRequest) {
    return this.http.patch(`${this.baseUrl}/${lessonNote.uid}`, lessonNote).pipe(
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
