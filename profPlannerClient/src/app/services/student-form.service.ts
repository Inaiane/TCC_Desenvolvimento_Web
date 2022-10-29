import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Student } from '../models/Student';

@Injectable({
  providedIn: 'root'
})
export class StudentFormService {

  _BS = new BehaviorSubject({ title: '', student: {} as Student });

  constructor() { }

  edit(student: any) {
    this._BS.next({ title: 'Edit User', student });
  }

  create() {
    this._BS.next({ title: 'Create User', student: {} as Student});
  }

  get title$() {
    return this._BS.asObservable().pipe(
      map(uf => uf.title)
    );
  }

  get student$() {
    return this._BS.asObservable().pipe(
      map(uf => uf.student)
    );
  }
}
