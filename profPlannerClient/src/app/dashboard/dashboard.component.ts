import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Lesson } from '../models/Lesson';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';
import { LessonsService } from '../services/lessons.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  lessons: Array<Lesson> = [];
  latestLessons: Array<Lesson> = [];
  haveLessons = true;
  currentUser: User | null;
  isLoggedIn: boolean = false;
  
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private lessonService: LessonsService,
    private spinnerService: NgxSpinnerService
    ) {
      this.currentUser = this.authenticationService.currentUserValue;
      this.authenticationService.isLoggedIn.subscribe(value => {
        this.isLoggedIn = value;
      });
    }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.getLessons();
  }

  getLessons() {
    this.spinnerService.show();
    const userId = this.currentUser ? this.currentUser.uid : "";
    this.lessonService.lessonsByUser(userId).subscribe(data => {
      console.log("getLessons -> data");
      console.log(data);
      this.lessons = data;
      this.haveLessons = this.lessons.length > 0;
      this.filterLessonsByDate();
      this.spinnerService.hide();
    },(err) => {
      console.log(err);
    });
  }

  filterLessonsByDate() {
    this.lessons.sort((a,b) => {
      let dateA = new Date(a.eventDate);
      let dateB = new Date(b.eventDate);
      return dateA.getTime() - dateB.getTime();
    });
    console.log("lessons");
    console.log(this.lessons);
    this.latestLessons = this.lessons.slice(0, 3);
    console.log("latestLessons");
    console.log(this.latestLessons);
  }

}
