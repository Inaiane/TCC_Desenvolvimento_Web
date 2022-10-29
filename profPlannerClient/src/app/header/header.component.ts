import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: User | null;
  isLoggedIn: boolean = false;
  userAvatarName = "";
  
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
    ) {
      this.currentUser = this.authenticationService.currentUserValue;
      this.userAvatarName = this.currentUser && this.currentUser.displayName 
                            ? this.currentUser.displayName.substring(0, 2).toUpperCase() : "";
       this.authenticationService.isLoggedIn.subscribe(value => {
        this.isLoggedIn = value;
      });
    }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    console.log("header -> currentUser");
    console.log(this.currentUser);
    console.log("header -> isLoggedIn");
    console.log(this.isLoggedIn);
  }

  logout() {
    this.authenticationService.logout();
  }

}
