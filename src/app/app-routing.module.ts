import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResumeAddComponent } from './resume/resume-add/resume-add.component';
import { ResumeEditComponent } from './resume/resume-edit/resume-edit.component';
import { ResumeListComponent } from './resume/resume-list/resume-list.component';

const routes: Routes = [
  { path: "", component: ResumeListComponent },
  { path: "create", component: ResumeEditComponent },
  { path: "edit/:resumeId", component: ResumeEditComponent },
  { path: "add", component: ResumeAddComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
