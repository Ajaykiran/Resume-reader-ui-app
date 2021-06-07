import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { ResumesService } from "../resumes.service";
import { Resume } from "../resume.model";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-resume-edit",
  templateUrl: "./resume-edit.component.html",
  styleUrls: ["./resume-edit.component.css"]
})
export class ResumeEditComponent implements OnInit, OnDestroy {
  resume: Resume;
  isLoading = false;
  form: FormGroup;
  filePreview: string;
  private mode = "create";
  private resumeId: string;
  private resumesSub: Subscription;

  constructor(
    public resumesService: ResumesService,
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(25)]
      }),
      email: new FormControl(null, { validators: [Validators.required] }),
      phoneNumber: new FormControl(null, { validators: [Validators.required] }),
      skills: new FormControl(null, { validators: [Validators.required] }),
      college: new FormControl(null, { validators: [Validators.required] }),
      currentEmployer: new FormControl(null, { validators: [Validators.required] }),
      file: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("resumeId")) {
        this.mode = "edit";
        this.resumeId = paramMap.get("resumeId");
        this.isLoading = true;
        this.resumesService.getResume(this.resumeId).subscribe(resumeData => {
          this.isLoading = false;
          this.resume = {
            id: resumeData._id,
            name: resumeData.name,
            email: resumeData.email,
            phoneNumber: resumeData.phoneNumber,
            skills: resumeData.skills,
            college: resumeData.college,
            currentEmployer: resumeData.currentEmployer,
            filePath: resumeData.filePath,
          };
          this.form.setValue({
            name: this.resume.name,
            email: this.resume.email,
            phoneNumber: this.resume.phoneNumber,
            skills: this.resume.skills,
            college: this.resume.college,
            currentEmployer: this.resume.currentEmployer,
            file: this.resume.filePath
          });
        })
      } else {
        this.mode = "create";
        this.resumeId = null;
      }
    });
  }

  onFilePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ file: file });
    this.form.get("file").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.filePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSaveResume() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.resumesService.addResume(
        this.form.value.name,
        this.form.value.email,
        this.form.value.phoneNumber,
        this.form.value.skills,
        this.form.value.college,
        this.form.value.currentEmployer,
        this.form.value.file
      );
    } else {
      this.resumesService.updateResume(
        this.resumeId,
        this.form.value.name,
        this.form.value.email,
        this.form.value.phoneNumber,
        this.form.value.skills,
        this.form.value.college,
        this.form.value.currentEmployer,
        this.form.value.file
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.resumesSub.unsubscribe();
  }
}
