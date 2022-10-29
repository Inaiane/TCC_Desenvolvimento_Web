import { Component, NgZone, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, filter } from 'rxjs/operators';
import { UsersService } from './../services/users.service';
import { User } from '../models/user';
import { AcademicSubject } from '../models/Subject';
import Validation from '../utils/validation';
import { NotificationService } from '../services/notification.service';
import { AuthenticationService } from '../services/authentication.service';
import * as subjectsData from '../utils/subjects.json';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  userForm: FormGroup = new FormGroup({
    displayName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl('')
  });
  showRegistrationForm = false;
  submitted = false;
  invalidSubjectForm = false;
  subjects: Array<AcademicSubject> = (subjectsData as any).default;
  subjectsSelected: Array<AcademicSubject> = [];
  users$: Observable<User[]> | undefined;
  user$: Observable<User> | undefined;

  constructor(
    private userService: UsersService,
    private notifyService : NotificationService,
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    private afAuth: AngularFireAuth,
    public authenticationService: AuthenticationService
    ) { };

  ngOnInit(): void { 
    this.userForm = this.fb.group({
      displayName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(8)]],
      confirmPassword: [['', Validators.required]],
      role: "admin"
    },{
      validators: [Validation.match('password', 'confirmPassword')]
    });

    this.users$ = this.userService.users$;

    this.user$ = this.afAuth.user.pipe(
      filter(user => !!user),
      switchMap(user => this.userService.user$(user!.uid))
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  signInWithGoogle(): void {
  }

  async signUp() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    }

    const userData = {...this.userForm.value, subjects: this.subjectsSelected}

    try {
      await this.authenticationService.signUp(userData)
      .then(_ => {
        console.log('user created');
        this.notifyService.showSuccess("Usuário criado com sucesso!", "");
        this.router.navigate(['/dashboard']);
      });
    } catch (err) {
        console.log('err');
        console.log(err);
        this.notifyService.showError("Erro ao criar usuário!", "");
    }
  }

  changeSubjectSelected(event: Event, subject: AcademicSubject) {
    const input = event.target as HTMLInputElement;

    if( input.checked && subject ) {
      this.subjectsSelected.push(subject);
    }

    if( !input.checked && subject ) {
      const indexOfObject = this.subjectsSelected.findIndex(object => {
        return object.value === subject.value;
      });
      this.subjectsSelected.splice(indexOfObject, 1);
    }
  }

  showSignUpForm() {
   if (this.subjectsSelected.length) {
    this.showRegistrationForm = true;
   }
  }
}
