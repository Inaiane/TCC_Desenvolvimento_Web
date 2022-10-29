import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentFormComponent } from '../student-form/student-form.component';
import { StudentsService } from '../services/students.service'
import { Student } from '../models/Student';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { StudentFormService } from '../services/student-form.service';
import { NotificationService } from '../services/notification.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  students:Array<Student> = [];
  currentUser: User | null;
  haveStudents = true;
  faTrash = faTrash;
  faPen = faPen;

  constructor(private modal: NgbModal,
    private studentService: StudentsService,
    private studentFormService: StudentFormService,
    private notifyService : NotificationService,
    private spinnerService: NgxSpinnerService,
    private authenticationService: AuthenticationService
    ) { 
      this.currentUser = this.authenticationService.currentUserValue;
    }

  ngOnInit(): void {
    this.getStudents();
  }

  openModal() {
    this.modal.open(StudentFormComponent);
  }

  getStudents() {
    this.spinnerService.show();
    const userId = this.currentUser ? this.currentUser.uid : "";
    this.studentService.studentsByUser(userId).subscribe(data => {
      console.log("getStudents -> data");
      console.log(data);
      this.students = data;
      this.haveStudents = this.students.length > 0;
      this.spinnerService.hide();
    }, (err) => {
      console.log(err);
    });
  }

  create() {
    this.studentFormService.create();
    const modalRef = this.modal.open(StudentFormComponent);
    modalRef.result.then(student => {
      console.log('student');
      console.log(student);
      this.studentService.create(student).subscribe(_ => {
        console.log('student created');
        this.notifyService.showSuccess("Estudante cadastrado!", "");
        this.getStudents();
      },(err) => {
        console.log('err');
        console.log(err);
        this.notifyService.showError("Erro no cadastro de estudante!", "");
      });
    });
  }

  editStudent(studentId: string){
    let studentCurrent = {};

    studentCurrent = this.students.filter(elem => elem.uid == studentId)[0];
    console.log("studentCurrent");
    console.log(studentCurrent);
    this.studentFormService.edit(studentCurrent);
    const modalRef = this.modal.open(StudentFormComponent);
    modalRef.result.then(student => {
      this.studentService.edit(student).subscribe(_=> {
        console.log('user edited');
        this.notifyService.showSuccess("Cadastro de estudante atualizado!", "");
        this.getStudents();
      },(err) => {
        console.log('err');
        console.log(err);
        this.notifyService.showError("Erro ao editar cadastro de estudante!", "");
      });
    });
  }

  removeStudent(studentId: string){
    if (studentId) {
      this.studentService.remove(studentId).subscribe(_ => {
        console.log('student removed');
        this.notifyService.showSuccess("Estudante removido!", "");
        this.getStudents();
      },(err) => {
        console.log('err');
        console.log(err);
        this.notifyService.showError("Erro ao remover cadastro de estudante!", "");
      });
    }
  }

}
