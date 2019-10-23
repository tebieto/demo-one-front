import { Injectable} from '@angular/core';
import { throwError, Subject} from 'rxjs';
import { Http, Headers, Response} from '@angular/http';
import { map, catchError} from 'rxjs/operators';
import { Config } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: string;
  locationUrl: string;

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

  fetchInnovateSettings() {
    this.baseUrl = Config.api + 'admin/custom/settings'
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

  systemOverview() {
    this.baseUrl = Config.api + 'admin/system/overview'
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

  userOverview(id: number) {
    this.baseUrl = Config.api + 'user/report/'+ id
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


  saveInnovateSettings(data) {
    this.baseUrl = Config.api + 'admin/custom/settings'
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

  updateIdea(data) {
    this.baseUrl = Config.api + 'ideas/edit'
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

  addMentor(data: object) {
    this.baseUrl = Config.api + 'mentee/pair/request/'
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
    this.baseUrl = Config.api + 'mentors/pair/'+id
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

  approveCertificate(id: number) {
    this.baseUrl = Config.api + 'mentors/verifi/certificate/'+id
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

  removeMentee(id: number) {
    this.baseUrl = Config.api + 'mentors/pair/reject/'+id
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

  approveIdea(data: object) {
    
    this.baseUrl = Config.api + 'mentors/idea/approve'
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

  rejectIdea(data: object) {
    
    this.baseUrl = Config.api + 'mentors/idea/reject'
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

  committeeApproveIdea(data: object) {
    
    this.baseUrl = Config.api + 'committee/idea/approve'
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

  committeeRejectIdea(data: object) {
    
    this.baseUrl = Config.api + 'committee/idea/reject'
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

  pendingMentors() {
    this.baseUrl = Config.api + 'mentee/pending/mentor/'
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

  menteeCertificates() {
    this.baseUrl = Config.api + 'mentee/certificate/'
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

  pendingCertificates() {
    this.baseUrl = Config.api + 'mentors/pending/certificate/'
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

  allNotifications() {
    this.baseUrl = Config.api + 'notification/'
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

  readAllNotifications() {
    this.baseUrl = Config.api + 'notification/read'
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

  pendingMentorMentees() {
    this.baseUrl = Config.api + 'mentors/mentees/pending'
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

  deleteIdea(id: number) {
    this.baseUrl = Config.api + 'ideas/'+id
    return this.http.delete(
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

  editMentorSetup(data) {
    this.baseUrl = Config.api + 'mentors/programme/edit'
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

  saveCertificate(data) {
    this.baseUrl = Config.api + 'mentee/certificate'
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

  
  updateUser(data: object){
    this.baseUrl = Config.api+ 'user/profile/update'
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

  notifyMe(data:object, url) {
    var img = '/assets/images/app-logo.png';
    var title = 'Lagos Innovate Ideahub'
    var text = data['sender']+' '+ data['action'];
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support system notifications");
      // This is not how you would really do things if they aren't supported. :)
    }
  
    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      var notification = new Notification(title, { body: text, icon: img });
    }
  
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          var notification = new Notification('To do list', { body: text, icon: img });
        }
      });
    }
  
    // Finally, if the user has denied notifications and you 
    // want to be respectful there is no need to bother them any more.

    notification.onclick = function(event) {
      event.preventDefault(); // prevent the browser from focusing the Notification's tab
      window.open(url, '_blank');
    }
  }

}
