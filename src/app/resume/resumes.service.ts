
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Resume } from "./resume.model";
import { SingleResume } from "./SingleResume.model";

const BACKEND_URL = environment.apiUrl + "/resumes/";

@Injectable({ providedIn: "root" })
export class ResumesService {
  private resumes: Resume[] = [];
  private resumesUpdated = new Subject<{ resumes: Resume[]; resumeCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getResumes(resumesPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${resumesPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; resumes: any; maxResumes: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(resumeData => {
          return {
            resumes: resumeData.resumes.map((resume: { name: any; email: any; phoneNumber: any; skills: any; college: any; currentEmployer: any; _id: any; filePath: any; }) => {
              return {
                name: resume.name,
                email: resume.email,
                phoneNumber: resume.phoneNumber,
                skills: resume.skills,
                college: resume.college,
                currentEmployer: resume.currentEmployer,
                id: resume._id,
                filePath: resume.filePath,
              };
            }),
            maxResumes: resumeData.maxResumes
          };
        })
      )
      .subscribe(transformedResumeData => {
        this.resumes = transformedResumeData.resumes;
        this.resumesUpdated.next({
          resumes: [...this.resumes],
          resumeCount: transformedResumeData.maxResumes
        });
      });
  }

  getResumeUpdateListener() {
    return this.resumesUpdated.asObservable();
  }

  getResume(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      email: string;
      phoneNumber: string;
      skills: string;
      college: string;
      currentEmployer: string;
      filePath: string;
    }>(BACKEND_URL + id);
  }

  addResume(name: string, email: string, phoneNumber: string, skills: string, college: string, currentEmployer: string, file: File) {
    const resumeData = new FormData();
    resumeData.append("name", name);
    resumeData.append("email", email);
    resumeData.append("phoneNumber", phoneNumber);
    resumeData.append("skills", skills);
    resumeData.append("college", college);
    resumeData.append("currentEmployer", currentEmployer);
    resumeData.append("image", file, name);
    this.http
      .post<{ message: string; resume: Resume }>(
        BACKEND_URL,
        resumeData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  addSingleResume(file: File) {
    const resumeData = new FormData();
    resumeData.append("image", file);
    this.http
      .post<{ message: string; resume: SingleResume }>(
        BACKEND_URL,
        resumeData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateResume(id: string, name: string, email: string, phoneNumber: string, skills: string, college: string, currentEmployer: string, file: File | string) {
    let resumeData: Resume | FormData;
    if (typeof file === "object") {
      resumeData = new FormData();
      resumeData.append("id", id);
      resumeData.append("name", name);
      resumeData.append("email", email);
      resumeData.append("phoneNumber", phoneNumber);
      resumeData.append("skills", skills);
      resumeData.append("college", college);
      resumeData.append("currentEmployer", currentEmployer);
      resumeData.append("image", file, name);
    } else {
      resumeData = {
        id: id,
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        skills: skills,
        college: college,
        currentEmployer: currentEmployer,
        filePath: file
      };
    }
    this.http
      .put(BACKEND_URL + id, resumeData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  downloadResume(resumeId: string) {
    return this.http.get<{
      _id: string;
      filePath: string;
    }>(BACKEND_URL + resumeId);
  }

  deleteResume(resumeId: string) {
    return this.http.delete(BACKEND_URL + resumeId);
  }
}
