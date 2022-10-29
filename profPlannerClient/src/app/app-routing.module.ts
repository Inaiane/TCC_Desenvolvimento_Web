import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './helpers/auth.guard';
import { HomeComponent } from './home/home.component';
import { LessonDetailComponent } from './lesson-detail/lesson-detail.component';
import { LessonsComponent } from './lessons/lessons.component';
import { PricingComponent } from './pricing/pricing.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { StudentsComponent } from './students/students.component';
import { UserAccountComponent } from './user-account/user-account.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'about', component: AboutComponent},
  {path: 'pricing', component: PricingComponent},
  {path: 'signin', component: SignInComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'userAccount', component: UserAccountComponent, canActivate: [AuthGuard]},
  {path: 'lessons', component: LessonsComponent, canActivate: [AuthGuard]},
  {path: 'lessons/:id', component: LessonDetailComponent, canActivate: [AuthGuard]},
  {path: 'students', component: StudentsComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
