import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { LessonNote } from '../models/LessonNote';

@Injectable({
  providedIn: 'root'
})
export class LessonNotesFormService {

  _BS = new BehaviorSubject({ title: '', lessonId: '', lessonNote: {} as LessonNote });

  constructor() { }

  edit(lessonNote: any, lessonId: string) {
    this._BS.next({ title: 'Editar Anotação', lessonId: lessonId, lessonNote });
  }

  create(lessonId: string) {
    this._BS.next({ title: 'Criar Anotação', lessonId: lessonId, lessonNote: {} as LessonNote});
  }

  get lessonId$() {
    return this._BS.asObservable().pipe(
      map(uf => uf.lessonId)
    );
  }

  get title$() {
    return this._BS.asObservable().pipe(
      map(uf => uf.title)
    );
  }

  get lessonNote$() {
    return this._BS.asObservable().pipe(
      map(uf => uf.lessonNote)
    );
  }
}
