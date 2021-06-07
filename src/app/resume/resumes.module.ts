import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { ResumeEditComponent } from "./resume-edit/resume-edit.component";
import { ResumeListComponent } from "./resume-list/resume-list.component";
import { AngularMaterialModule } from "../angular-material.module";
import { ResumeAddComponent } from "./resume-add/resume-add.component";

@NgModule({
  declarations: [ResumeEditComponent, ResumeListComponent, ResumeAddComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class ResumesModule { }
