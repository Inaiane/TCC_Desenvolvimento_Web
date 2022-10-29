import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, tap } from 'rxjs';
import { Lesson } from '../models/Lesson';
import { Student } from '../models/Student';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';
import { LessonFormService } from '../services/lesson-form.service';
import { StudentFormService } from '../services/student-form.service';
import { StudentsService } from '../services/students.service';
import { StudentFormComponent } from '../student-form/student-form.component';

@Component({
  selector: 'app-lesson-form',
  templateUrl: './lesson-form.component.html',
  styleUrls: ['./lesson-form.component.css']
})
export class LessonFormComponent implements OnInit {
  @Input() name: any;
  students:Array<Student> = [];
  currentUser: User | null;
  title$: Observable<string> | undefined;
  lesson$: Observable<{}> | undefined;
  currentLesson: Lesson | undefined;
  dateTime = new Date();
  lessonForm = new FormGroup({
    description: new FormControl(''),
    student: new FormControl(''),
    duration: new FormControl(''),
    subject: new FormControl(''),
    cost: new FormControl(0),
    eventDate: new FormControl(this.dateTime.toISOString().substring(0, 16)),
  });

  submitted = false;

  constructor ( 
    private modal: NgbModal, 
    private modalActive: NgbActiveModal,
    public fb: FormBuilder,
    private lessonFormService: LessonFormService,
    private studentService: StudentsService,
    private studentFormService: StudentFormService,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.getStudents();

    this.title$ = this.lessonFormService.title$;
    this.lesson$ = this.lessonFormService.lesson$.pipe(
      tap(lesson => {
        if (lesson) {
          this.currentLesson = lesson;
          this.lessonForm.patchValue(lesson);
        } else {
          this.lessonForm.reset({});
        }
      })
    );
    
    this.lessonForm = this.fb.group({
      description: ['', [Validators.required]],
      student: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      cost: ['', [Validators.required]],
      eventDate: ['', [Validators.required]]
    });
  }

  changeStudent(e: any) {
    this.student?.setValue(e.target.value, {
      onlySelf: true,
    });
  }
  
  get student() {
    return this.lessonForm.get('student');
  }

  changeSubject(e: any) {
    this.subject?.setValue(e.target.value, {
      onlySelf: true,
    });
  }
  
  get subject() {
    return this.lessonForm.get('subject');
  }

  dismiss() {
    this.modalActive.dismiss();
  }

  openStudentFormModal() {
    this.studentFormService.create();
    const modalRef = this.modal.open(StudentFormComponent);
    modalRef.result.then(student => {
      if (student) {
        console.log('student');
        console.log(student);
        this.studentService.create(student).subscribe(_ => {
          console.log('student created');
          this.getStudents();
        },(err) => {
          console.log('err');
          console.log(err);
        });
      }
    });
  }

  getStudents() {
    this.studentService.students.subscribe(data => {
      console.log("getStudents -> data");
      console.log(data);
      this.students = data;
    }, (err) => {
      console.log(err);
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.lessonForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.lessonForm.invalid) {
      return;
    }

    let lessonData;
    if (this.currentLesson 
        && this.currentLesson.uid ) {
      lessonData = {...this.lessonForm.value,
                      uid: this.currentLesson.uid,
                      professor: this.currentUser?.uid,
                      role: 'admin'};
      this.modalActive.close(lessonData);
    }
    
    lessonData = {...this.lessonForm.value, professor: this.currentUser?.uid, role: 'admin'};
    
    if (lessonData) {
      let studentId = lessonData.student;
      let studentSelected = this.students.filter(item => item.uid === studentId)[0];
      lessonData.student = studentSelected ? studentSelected : {} as Student;

      let subjectValue = !isNaN(lessonData.subject) ? Number(lessonData.subject) : lessonData.subject;
      let subjectSelected = this.currentUser?.subjects.filter(item => item.value === subjectValue)[0];
      lessonData.subject = subjectSelected ? subjectSelected : {};
    }

    this.modalActive.close(lessonData);
  }

}
