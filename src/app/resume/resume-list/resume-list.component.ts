import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";

import { Resume } from "../resume.model";
import { ResumesService } from "../resumes.service";


@Component({
  selector: "app-resume-list",
  templateUrl: "./resume-list.component.html",
  styleUrls: ["./resume-list.component.css"]
})
export class ResumeListComponent implements OnInit, OnDestroy {

  resumes: Resume[] = [];
  isLoading = false;
  totalResumes = 0;
  resumesPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private resumesSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public resumesService: ResumesService) { }

  ngOnInit() {
    this.isLoading = true;
    this.resumesService.getResumes(this.resumesPerPage, this.currentPage);
    this.resumesSub = this.resumesService
      .getResumeUpdateListener()
      .subscribe((resumeData: { resumes: Resume[]; resumeCount: number }) => {
        this.isLoading = false;
        this.totalResumes = resumeData.resumeCount;
        this.resumes = resumeData.resumes;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.resumesPerPage = pageData.pageSize;
    this.resumesService.getResumes(this.resumesPerPage, this.currentPage);
  }

  onDelete(resumeId: string) {
    this.isLoading = true;
    this.resumesService.deleteResume(resumeId).subscribe(() => {
      this.resumesService.getResumes(this.resumesPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  onDownload(resumeId: string) {
    this.isLoading = true;
    this.resumesService.downloadResume(resumeId).subscribe(() => {
      this.resumesService.getResumes(this.resumesPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.resumesSub.unsubscribe();
  }
}
