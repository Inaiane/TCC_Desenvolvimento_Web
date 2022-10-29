import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { UserAccountComponent } from './user-account/user-account.component';
import { PricingComponent } from './pricing/pricing.component';
import { environment } from 'src/environments/environment';
import { AuthTokenHttpInterceptorProvider } from './http-interceptors/auth-token.interceptor';
import { LessonFormComponent } from './lesson-form/lesson-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LessonsComponent } from './lessons/lessons.component';
import { StudentFormComponent } from './student-form/student-form.component';
import { StudentsComponent } from './students/students.component';
import { AboutComponent } from './about/about.component';
import { LessonNotesFormComponent } from './lesson-notes-form/lesson-notes-form.component';
import { QuestionsComponent } from './questions/questions.component';
import { LessonDetailComponent } from './lesson-detail/lesson-detail.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
    SignUpComponent,
    FooterComponent,
    HeaderComponent,
    UserAccountComponent,
    PricingComponent,
    LessonFormComponent,
    DashboardComponent,
    LessonsComponent,
    StudentFormComponent,
    StudentsComponent,
    AboutComponent,
    LessonNotesFormComponent,
    QuestionsComponent,
    LessonDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    HttpClientModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    AuthTokenHttpInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
