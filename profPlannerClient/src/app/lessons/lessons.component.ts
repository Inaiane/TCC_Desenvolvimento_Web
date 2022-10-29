import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LessonFormComponent } from '../lesson-form/lesson-form.component';
import { Lesson } from '../models/Lesson';
import { LessonFormService } from '../services/lesson-form.service';
import { LessonsService } from '../services/lessons.service';
import { NotificationService } from '../services/notification.service'
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.css']
})
export class LessonsComponent implements OnInit {

  lessons: Array<Lesson> = [];
  currentUser: User | null;
  haveLessons = true;
  toastMessage = "";
  toastElement = document.getElementById('toast-success');
  faTrash = faTrash;
  faPen = faPen;

  constructor(
    private modal: NgbModal,
    private router: Router,
    private lessonService: LessonsService,
    private lessonFormService: LessonFormService,
    private notifyService : NotificationService,
    private spinnerService: NgxSpinnerService,
    private authenticationService: AuthenticationService
    ) {
      this.currentUser = this.authenticationService.currentUserValue;
    }

  ngOnInit(): void {
    this.getLessons();
  }

  openModal() {
    this.modal.open(LessonFormComponent);
  }

  getLessons() {
    this.spinnerService.show();
    const userId = this.currentUser ? this.currentUser.uid : "";
    this.lessonService.lessonsByUser(userId).subscribe(data => {
      console.log("getLessons -> data");
      console.log(data);
      this.lessons = data;
      this.haveLessons = this.lessons.length > 0;
      this.spinnerService.hide();
    },(err) => {
      console.log(err);
    });
  }

  createLesson() {
    this.lessonFormService.create();
    const modalRef = this.modal.open(LessonFormComponent);
    modalRef.result.then(lesson => {
      console.log('createLesson -> lesson');
      console.log(lesson);
      this.lessonService.create(lesson).subscribe(_ => {
        console.log('lesson created');
        this.notifyService.showSuccess("Aula criada!", "");
        this.getLessons();
      },(err) => {
        console.log('err');
        console.log(err);
        this.notifyService.showError("Erro ao criar Aula!", "");
      });
    });
  }

  editLesson(lessonId: string){
    let currentLesson = {};

    currentLesson = this.lessons.filter(elem => elem.uid == lessonId)[0];
    console.log("editStudent -> currentLesson");
    console.log(currentLesson);
    
    this.lessonFormService.edit(currentLesson);
    const modalRef = this.modal.open(LessonFormComponent);
    modalRef.result.then(lesson => {
      console.log("lesson");
      console.log(lesson);
      this.lessonService.edit(lesson).subscribe(_=> {
        console.log('lesson edited');
        this.notifyService.showSuccess("Aula editada!", "");
        this.getLessons();
      });
    }).catch(err => {
      console.log('err');
      console.log(err);
      this.notifyService.showError("Erro ao editar Aula!", "");
    });
  }

  removeLesson(lessonId: string){
    console.log("removeLesson -> lessonId");
    console.log(lessonId);
    if (lessonId) {
      this.lessonService.remove(lessonId).subscribe(_ => {
        console.log('Lesson removed');
        this.notifyService.showSuccess("Aula removida!", "");
        this.getLessons();
      },(err) => {
        console.log('err');
        console.log(err);
        this.notifyService.showError("Erro ao remover Aula!", "");
      });
    }
  }

  goLessonDetail(lessonId: string) {
    console.log("lessonId");
    console.log(lessonId);
    this.router.navigate(
      ['/lessons', lessonId ]);
  }


}
