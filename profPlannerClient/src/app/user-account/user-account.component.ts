
import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { User } from '../models/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthenticationService } from '../services/authentication.service';
import { Observable, tap } from 'rxjs';
import { NotificationService } from '../services/notification.service';


@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {

  currentUser: User | null;
  userId: string | undefined = "";
  editMode: boolean = false;
  user$: Observable<{}> | undefined;

  userForm: FormGroup = new FormGroup({
    displayName: new FormControl(''),
    email: new FormControl(''),
    lastName: new FormControl(''),
    password: new FormControl(''),
    birthDate: new FormControl(''),
    phoneNumber: new FormControl(''),
    address: new FormControl(''),
    cep: new FormControl('')
  });
 
  submitted = false;
  
  constructor (
    public fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UsersService,
    private notifyService : NotificationService
    ) {
      this.currentUser = this.authenticationService.currentUserValue;
    }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.userForm = this.fb.group({
      displayName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      lastName: ['', [Validators.maxLength(25)]],
      birthDate: ['', [Validators.required]],
      phoneNumber: ['', [Validators.minLength(11),
        Validators.maxLength(11)]],
      address: ['', [Validators.maxLength(30)]],
      cep: ['', [Validators.maxLength(10)]],
      password: ['', [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(8)]],
      role: "admin"
    });

    if ( this.currentUser ) {
      this.userForm.patchValue(this.currentUser);
    } else {
      this.userForm.reset({});
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }

  updateUser(): void {
    this.submitted = true;
    let userId = this.currentUser?.uid; 

    console.log("this.userForm")
    console.log(this.userForm?.value)

    if (this.userForm.invalid) {
      return;
    }
    let userData = {...this.userForm?.value, uid: userId};

    console.log("userData")
    console.log(userData)

    this.userService.edit(userData)
    .subscribe(() => {
      this.editMode = false;
      console.log('User edited susccessfully');
      this.notifyService.showSuccess("Usuário editado com sucesso!", "");
      const {
        displayName,
        lastName,
        email,
        birthDate,
        phoneNumber,
        address,
        cep} = userData;
      const userUpdated = {...this.currentUser,
        displayName, 
        lastName,
        email,
        birthDate,
        phoneNumber,
        address,
        cep};
      this.authenticationService.currentUserSubject.next(userUpdated as User);
      localStorage.setItem('currentUser', JSON.stringify(userUpdated));
      this.refresh();
      }, (err) => {
        console.log(err);
    });
  }

  refresh(): void {
    window.location.reload();
  }

}
