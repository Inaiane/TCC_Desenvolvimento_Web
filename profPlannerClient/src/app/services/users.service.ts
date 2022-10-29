import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../models/user';
import { map, first } from 'rxjs/operators';
import { Observable } from 'rxjs';

export type CreateUserRequest = { displayName: string, password: string, email: string, role: string };
export type UpdateUserRequest = { uid: string } & CreateUserRequest;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl = 'http://localhost:5001/profplanner-e8ca0/us-central1/api/users'

  constructor(
    private http: HttpClient,
    public afAuth: AngularFireAuth
  ) { }


  get users$(): Observable<User[]> {
    return this.http.get<{ users: User[] }>(`${this.baseUrl}`).pipe(
      map(result => {
        return result.users;
      })
    );
  }

  user$(id: string): Observable<User> {
    return this.http.get<{ user: User }>(`${this.baseUrl}/${id}`).pipe(
      map(result => {
        return result.user;
      })
    );
  }

  create(user: CreateUserRequest) {
    return this.http.post<{ uid: string }>(`${this.baseUrl}`, user).pipe(
      map(result => {
        return result.uid;
      })
    );
  }

  edit(user: UpdateUserRequest) {
    return this.http.patch(`${this.baseUrl}/${user.uid}`, user).pipe(
      map(_ => { })
    );
  }

}