import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Lesson } from '../models/Lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonFormService {

  _BS = new BehaviorSubject({ title: '', lesson: {} as Lesson });

  constructor() { }

  edit(lesson: any) {
    this._BS.next({ title: 'Editar Aula', lesson });
  }

  create() {
    this._BS.next({ title: 'Cadastrar Aula', lesson: {} as Lesson});
  }

  get title$() {
    return this._BS.asObservable().pipe(
      map(uf => uf.title)
    );
  }

  get lesson$() {
    return this._BS.asObservable().pipe(
      map(uf => uf.lesson)
    );
  }
}
