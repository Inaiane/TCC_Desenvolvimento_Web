import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, tap } from 'rxjs';
import { LessonNote } from '../models/LessonNote';
import { LessonNotesFormService } from '../services/lesson-notes-form.service';

@Component({
  selector: 'app-lesson-notes-form',
  templateUrl: './lesson-notes-form.component.html',
  styleUrls: ['./lesson-notes-form.component.css']
})
export class LessonNotesFormComponent implements OnInit {

  currentLessonNote : LessonNote | undefined;
  title$: Observable<string> | undefined;
  lessonNote$: Observable<{}> | undefined;
  lessonId = "";
  submitted = false;
  noteForm = new FormGroup({
    title: new FormControl(''),
    note: new FormControl('')
  });

  
  constructor(
    private lessonNotesFormService : LessonNotesFormService,
    private activeModalService: NgbActiveModal,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.noteForm = this.fb.group({
      title: ['', [Validators.required]],
      note: ['', [Validators.required]]
    });

    this.title$ = this.lessonNotesFormService.title$;
    this.lessonNotesFormService.lessonId$.subscribe((lessonId : string) => {
      this.lessonId = lessonId;
    });
    this.lessonNote$ = this.lessonNotesFormService.lessonNote$.pipe(
      tap(lessonNote => {
        if (lessonNote) {
          this.currentLessonNote = lessonNote;
          this.noteForm.patchValue(lessonNote);
        } else {
          this.noteForm.reset({});
        }
      })
    );
  }

  dismiss() {
    this.activeModalService.dismiss();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.noteForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.noteForm.invalid) {
      return;
    }

    let noteData;
    if (this.currentLessonNote?.uid) {
      noteData = {...this.noteForm.value, uid: this.currentLessonNote.uid, lessonId: this.lessonId, role: 'admin'};
      this.activeModalService.close(noteData);
    }

    noteData = {...this.noteForm.value, lessonId: this.lessonId, role: 'admin'};
    this.activeModalService.close(noteData);
  }

}
