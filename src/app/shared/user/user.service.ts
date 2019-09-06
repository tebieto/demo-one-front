import { Injectable} from '@angular/core';
import { throwError} from 'rxjs';
import { Http, Headers, Response} from '@angular/http';
import { map, catchError} from 'rxjs/operators';
import { Config } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: string
  locationUrl: string

  constructor(
    private http: Http, 
  ) { }

  getLocation(){
    this.locationUrl = Config.ipChecker
    return this.http.get(
      this.locationUrl
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  validateUser(){
    this.baseUrl = Config.api + 'token/validate'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  superAdmin(){
    this.baseUrl = Config.api + 'admin/super/exist'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  appOwner(){
    this.baseUrl = Config.api + 'owner/exist'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  createMultiUser(data) {
    this.baseUrl = Config.api + 'admin/invite/csv'
    return this.http.post(
      this.baseUrl,
      data,
      {headers:this.getUploadHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  uploadImage(data) {
    this.baseUrl = Config.api + 'upload/image'
    return this.http.post(
      this.baseUrl,
      data,
      {headers:this.getUploadHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  uploadFile(data) {
    this.baseUrl = Config.api + 'upload/document'
    return this.http.post(
      this.baseUrl,
      data,
      {headers:this.getUploadHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  industries() {
    this.baseUrl = Config.api + 'industry'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  createSingleUser(data) {
    this.baseUrl = Config.api + 'admin/invite'
    return this.http.post(
      this.baseUrl,
      data,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  idea(data) {
    this.baseUrl = Config.api + 'ideas/create'
    return this.http.post(
      this.baseUrl,
      data,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  forum(data) {
    this.baseUrl = Config.api + 'forums/create'
    return this.http.post(
      this.baseUrl,
      data,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  forumMessage(data) {
    this.baseUrl = Config.api + 'forums/conversation'
    return this.http.post(
      this.baseUrl,
      data,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  chatMessage(data) {
    this.baseUrl = Config.api + 'chats/create'
    return this.http.post(
      this.baseUrl,
      data,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  addMentee(id: number) {
    this.baseUrl = Config.api + 'mentee/pair/'+id
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  approveIdea(id: number) {
    this.baseUrl = Config.api + 'committee/idea/approve/'+id
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  rejectIdea(id: number) {
    this.baseUrl = Config.api + 'committee/idea/reject/'+id
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  hasPendingIdea() {
    this.baseUrl = Config.api + 'ideas/post/wait'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  userIdeas() {
    this.baseUrl = Config.api + 'ideas/user'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  mentorIdeas() {
    this.baseUrl = Config.api + 'mentors/mentees/ideas'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  allUserIdeas() {
    this.baseUrl = Config.api + 'committee/allideas'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  allInvitedUsers() {
    this.baseUrl = Config.api + 'admin/invitation/status'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  userForums() {
    this.baseUrl = Config.api + 'forums/all'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  userChats() {
    this.baseUrl = Config.api + 'chats/all'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  menteeMentors() {
    this.baseUrl = Config.api + 'mentors/'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  mentorMentees() {
    this.baseUrl = Config.api + 'mentors/mentees'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  forumMessages(id: number) {
    this.baseUrl = Config.api + 'forums/conversations/'+id
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  chatMessages(id: number) {
    this.baseUrl = Config.api + 'chats/conversation/'+id
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  verifyMentorSetup() {
    this.baseUrl = Config.api + 'mentors/setup/verify'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  saveMentorSetup(data) {
    this.baseUrl = Config.api + 'mentors/programme/setup'
    return this.http.post(
      this.baseUrl,
      data,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  getCommonHeaders(){
    let token = localStorage.getItem('token')
    let bearer = Config.bearer+''+token
    let headers = new Headers();
    headers.append("content-type", "application/json");
    headers.append("authorization", bearer);
    return headers
  }

  
  getUploadHeaders(){
    let token = localStorage.getItem('token')
    let bearer = Config.bearer+''+token
    let headers = new Headers();
    headers.append("authorization", bearer);
    return headers
  }

  handleErrors(error: Response) {
    return throwError(error);
  }

}
