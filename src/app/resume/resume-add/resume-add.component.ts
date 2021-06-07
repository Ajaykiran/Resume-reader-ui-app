import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { mimeType } from "../resume-edit/mime-type.validator";
import { ResumesService } from "../resumes.service";

@Component({
    selector: "app-resume-add",
    templateUrl: "./resume-add.component.html",
    styleUrls: ["./resume-add.component.css"]
})

export class ResumeAddComponent implements OnInit {
    form: FormGroup;
    private mode = "create";
    private resumeId: string;

    constructor(
        public resumesService: ResumesService
    ) { }

    ngOnInit() {
        this.form = new FormGroup({
            file: new FormControl(null, {
                validators: [Validators.required],
                asyncValidators: [mimeType]
            })
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
        if (this.mode === "create") {
            this.resumesService.addSingleResume(
                this.form.value.file
            );
        }
        this.form.reset();
    }
}