import { Component, NgZone, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  currentUser: User | null;
  showSignInForm = false;
  submitted = false;

  constructor(
    public fb: FormBuilder,
    private ngZone: NgZone,
    private router: Router,
    public afAuth: AngularFireAuth,
    public authenticationService: AuthenticationService
    ) {
      this.currentUser = this.authenticationService.currentUserValue;
    }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', 
        [Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15)]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  loginWithGoogle(): void {
  }

  async loginWithEmail() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    try {
      await this.authenticationService.login(this.loginForm.value);
    } catch (err) {
      console.log(err)
    }
  }

}
