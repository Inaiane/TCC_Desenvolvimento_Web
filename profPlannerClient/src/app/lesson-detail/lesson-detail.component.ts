import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { LessonNotesFormComponent } from '../lesson-notes-form/lesson-notes-form.component';
import { Lesson } from '../models/Lesson';
import { LessonNote } from '../models/LessonNote';
import { LessonNotesFormService } from '../services/lesson-notes-form.service';
import { LessonNotesService } from '../services/lesson-notes.service';
import { LessonsService } from '../services/lessons.service';
import { NotificationService } from '../services/notification.service';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-lesson-detail',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.css']
})
export class LessonDetailComponent implements OnInit {
  lessonId : string | null = "";
  lesson: Lesson | undefined;
  lessonNotes : Array<LessonNote> = [];
  haveLessonNotes = true;
  faTrash = faTrash;
  faPen = faPen;

  constructor(
    private modal: NgbModal,
    private route: ActivatedRoute,
    private lessonService: LessonsService,
    private lessonNoteService : LessonNotesService,
    private lessonNotesFormService : LessonNotesFormService,
    private notifyService : NotificationService,
    private spinnerService: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    this.getLesson();
    this.getLessonNotes();
  }

  getLesson() {
    this.lessonId = this.route.snapshot.paramMap.get('id');
    if (this.lessonId) {
      this.lessonService.lesson(this.lessonId).subscribe(data => {
        this.lesson = data;
      });
    }
  }

  getLessonNotes() {
    console.log("getLessonNotes > this.lessonId");
    console.log(this.lessonId);
    if (this.lessonId) {
      this.lessonNoteService.lessonNotesByLesson(this.lessonId).subscribe(data => {
        this.lessonNotes = data;
        this.haveLessonNotes = this.lessonNotes?.length > 0;
      });
    }

  }

  createLessonNote() {
    if (this.lessonId) {
      this.lessonNotesFormService.create(this.lessonId);
      const modalRef = this.modal.open(LessonNotesFormComponent);
      modalRef.result.then(lessonNote => {
        this.lessonNoteService.create(lessonNote).subscribe(_ => {
          this.notifyService.showSuccess("Anotação criada!", "");
          this.getLessonNotes();
        },(err) => {
          console.log('err', err);
          this.notifyService.showError("Erro ao criar anotação!", "");
        });
      });
    }
  }

  editLessonNote(noteId: string) {
    let currentLessonNote = {};

    currentLessonNote = this.lessonNotes.filter(elem => elem.uid == noteId)[0];
    
    if (this.lessonId) {
      this.lessonNotesFormService.edit(currentLessonNote, this.lessonId);
      const modalRef = this.modal.open(LessonNotesFormComponent);
      modalRef.result.then(lessonNote => {
        this.lessonNoteService.edit(lessonNote).subscribe(_=> {
          this.notifyService.showSuccess("Anotação editada!", "");
          this.getLessonNotes();
        });
      }).catch(err => {
        console.log('err', err);
        this.notifyService.showError("Erro ao editar anotação!", "");
      });
    }
  }

  removeLessonNote(lessonId: string){
    if (lessonId) {
      this.lessonNoteService.remove(lessonId).subscribe(_ => {
        this.notifyService.showSuccess("Anotação removida!", "");
        this.getLessonNotes();
      },(err) => {
        console.log('err');
        console.log(err);
        this.notifyService.showError("Erro ao remover anotação!", "");
      });
    }
  }

}
