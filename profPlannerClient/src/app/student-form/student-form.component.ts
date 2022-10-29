import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, tap } from 'rxjs';
import { Student } from '../models/Student';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';
import { LessonsService } from '../services/lessons.service';
import { StudentFormService } from '../services/student-form.service';
import { StudentsService } from '../services/students.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})

export class StudentFormComponent implements OnInit {
  @Input() name: any;
  currentUser: User | null;
  title$: Observable<string> | undefined;
  student$: Observable<{}> | undefined;
  currentStudent : Student | undefined;
  submitted = false;
  
  studentForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    birthDate: new FormControl(''),
    subject: new FormControl(''),
    address: new FormControl(''),
  });

  constructor(
    private activeModalService: NgbActiveModal,
    public fb: FormBuilder,
    private studentService: StudentsService,
    private studentFormService: StudentFormService,
    private authenticationService: AuthenticationService
    ) {
      this.currentUser = this.authenticationService.currentUserValue;
    }

  ngOnInit(): void {
    this.studentForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', []],
      birthDate: ['', []],
      subject: ['', [Validators.required]],
      address: ['', []]
    });

    this.title$ = this.studentFormService.title$;
    this.student$ = this.studentFormService.student$.pipe(
      tap(student => {
        if (student) {
          this.currentStudent = student;
          this.studentForm.patchValue(student);
        } else {
          this.studentForm.reset({});
        }
      })
    );
  }

  changeSubject(e: any) {
    this.subject?.setValue(e.target.value, {
      onlySelf: true,
    });
  }
  
  get subject() {
    return this.studentForm.get('subject');
  }

  dismiss() {
    this.activeModalService.dismiss();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.studentForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.studentForm.invalid) {
      return;
    }

    console.log("save student");
    console.log(this.currentStudent);
    let studentData;
    if (this.currentStudent 
        && this.currentStudent.uid ) {
      studentData = {...this.studentForm.value,
                      uid: this.currentStudent.uid, 
                      professor: this.currentUser?.uid, 
                      role: 'admin'};
      this.activeModalService.close(studentData);
    }

    studentData = {...this.studentForm.value,
                    professor: this.currentUser?.uid,
                    role: 'admin'};

    if (studentData) {
      let subjectValue = !isNaN(studentData.subject) ? Number(studentData.subject) : studentData.subject;
      let subjectSelected = this.currentUser?.subjects.filter(item => item.value === subjectValue)[0];
      studentData.subject = subjectSelected ? subjectSelected : {};
    }
    
    this.activeModalService.close(studentData);
  }

}
