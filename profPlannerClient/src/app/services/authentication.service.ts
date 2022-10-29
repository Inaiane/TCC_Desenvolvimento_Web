import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { User } from '../models/user';
import { UsersService } from './users.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {
  currentUserSubject: BehaviorSubject<User | null>;
  currentUser: Observable<User | null>;
  public isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor(
    private router: Router,
    public afAuth: AngularFireAuth,
    private userService: UsersService
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    const currentUserJson = localStorage.getItem('currentUser');
    const userJson = currentUserJson ? JSON.parse(currentUserJson) : '';

    if (this.currentUserSubject && !this.currentUserSubject.value && userJson) {
      this.currentUserSubject!.next(userJson);
    } 

    if (this.currentUserSubject && this.currentUserSubject.value) {
      this.isLoggedIn.next(true);
      return this.currentUserSubject.value;
    }

    return null;
  }

  async login(credentials: any) {
    const { email, password } = credentials;
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password).then(data => {
        console.log("resp");
        console.log(data);
        return data;
      });
      const uid = userCredential?.user?.uid || "";
      this.userService.user$(uid).subscribe(data => {
        console.log("resp");
        console.log(data);
        let userData = data;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        this.currentUserSubject.next(userData as User);
        this.isLoggedIn.next(true);
        this.router.navigate(['/dashboard']);
      });
    } catch (err) {
      console.log(err)
      return;
    }
  }

  async signUp(userDataForm: any) {
    this.userService.create(userDataForm).subscribe((res: any) => {
      console.log('res');
      console.log(res);
      console.log('User created susccessfully');
      const userId = res ? res : "";
      const userData = {...userDataForm, uid: userId}
      console.log('userData');
      console.log(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      this.currentUserSubject.next(userData as User);
      this.isLoggedIn.next(true);
      this.router.navigate(['/dashboard']);
    }, (err) => {
      console.log(err);
    });
  }

  updateUser(userDataForm: any) {
    this.userService.edit(userDataForm).subscribe(result => {
      const currentUser = this.currentUserValue;
      const {displayName, lastName, email, birthDate, phoneNumber, address, cep} = userDataForm;
      const userUpdated = {...currentUser, displayName, lastName, email, birthDate, phoneNumber, address, cep};
      console.log("userUpdated");
      console.log(userUpdated);
      this.currentUserSubject!.next(userUpdated as User);
      console.log("this.currentUserValue");
      console.log(this.currentUserValue);
      localStorage.setItem('currentUser', JSON.stringify(userUpdated));
      this.isLoggedIn.next(true);
      return result;
    });
  }

  logout() {
    // remove user from local storage and set current user to null
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      this.isLoggedIn.next(false);
      this.router.navigate(['/signin']);
    });
  }

}