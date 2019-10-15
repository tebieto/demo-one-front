import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { MatSnackBar, MatDialog } from '@angular/material';
import { UserService } from 'src/app/shared/user/user.service';
import * as crypto from 'crypto-js';
import { SharedDialogComponent } from 'src/app/shared/shared-dialog/shared-dialog.component';
import {CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Subscription } from 'rxjs';
import { SharedMessageDialogComponent } from 'src/app/shared/shared-message-dialog/shared-message-dialog.component';

@Component({
  selector: 'app-mentor-profile',
  templateUrl: './mentor-profile.component.html',
  styleUrls: ['./mentor-profile.component.css']
})
export class MentorProfileComponent implements OnInit {

  user: object;
  isConnecting: boolean;
  hasError: boolean;
  params: object;
  mentorProfile: object;
  hasMentor: boolean;
  persistingData: boolean;
  subscription: Subscription;
  hasPendingMentor: boolean;
  enlargeAvatar: boolean;

  constructor(
    private _location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private userService: UserService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.validateUser()
    this.startCustomRouter()
  }

  validateUser(){
    this.isConnecting= true
    this.userService.validateUser()
    .subscribe(
      (res)=>{
        this.isConnecting=false
        if(res.code != 200) {
          this.hasError = true
          let message ='Invalid Session, Login Again.'
          this.logUserOut(message);
        }
  
        if(res.code==200) {
          if(res.body.mentor) {
            this.hasMentor = true
          }
          this.user = res.body.user
          this.getMentorProfile(this.params['code'])
          this.getPendingMentors()
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }

  getPendingMentors() {
    this.isConnecting = true
    const subscription = this.userService.pendingMentors()
    this.subscription = subscription
    .subscribe(
        (res)=>{
        this.isConnecting = false; 
        if(res.code==200) {
          if(res.body) {
           this.consumeResponse(res.body)
          } else {  
          }
        } else {     
        }
      },
      (error)=>{
        this.hasError = true
        this.isConnecting = false
        let notification = errorMessage.ConnectionError(error)
        this.openSnackBar(notification, 'snack-error')
  
      });
  }

  consumeResponse(data: object[]) {
    if(data.length>0) {this.hasPendingMentor=true}
  }

  chooseMentor(param: string) {
    let code = param
    let secret = this.makeSecret()
    let data = this.decrypt(code, secret)
    let message = 'Are you sure you want to make '+ data['value']['mentor']['full_name']+' your Mentor?';
    let msg = 'Briefly tell us why you want '+ data['value']['mentor']['full_name']+' to be your Mentor'
    this.openSheet(data.value, message, param, msg)
  }



  openSheet(data: object, message, param:string, msg:string): void {
    const dialogRef = this.dialog.open(SharedMessageDialogComponent, {
      width: '400px',
      data: {id:data['mentor']['id'], message:msg}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        return
      }
      this.openDialog(data, message, param, result)
    });
  }

  openDialog(data: object, message, param:string, msg): void {
    const dialogRef = this.dialog.open(SharedDialogComponent, {
      width: '250px',
      data: {id:data['mentor']['id'], message:message}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        return
      }
      this.addMentor(result, param, msg)
    });
  }

  addMentor(id: number, param:string, message: string) {
    let data = {
      'mentor_id': id,
      'mentee_message': message
    }
    this.persistingData = true
    this.userService.addMentor(data)
    .subscribe(
      (res)=>{
        this.persistingData=false
        if(res.code != 200) {
          this.hasError = true
          this.showErrorMessage(res)
        }
  
        if(res.code==200) {
          this.hasPendingMentor = true
          let notification = res.message
          this.openSnackBar(notification, 'snack-success')
         }
  
    },
    (error)=>{
      this.hasError = true
      this.persistingData = false
      let notification = errorMessage.ConnectionError(error)
      this.openSnackBar(notification, 'snack-error')
    });

  }

  getMentorProfile(param: string){
    let code = param
    let secret = this.makeSecret()
    let data = this.decrypt(code, secret)
    this.mentorProfile = data['value']
  }

  startCustomRouter(){
    this.route.params.subscribe(params=>{
          this.consumeRouteParams(params)
      });
  }

  consumeRouteParams(params: object) {
    this.params = params
  }

  decrypt(textToDecrypt : string, secret:string){
    this.isConnecting = true
    let data = crypto.AES.decrypt(textToDecrypt.replace(/atala/g,'/'), secret.trim()).toString(crypto.enc.Utf8);

    if(!data) {
      return null
    }
    
    data = JSON.parse(data)
     this.isConnecting = false
    return data
   }
 
    makeSecret() {
     var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return 'atala%'+this.user['id'];
  }

  logUserOut(message:string){
    this.clearToken()
    let notification = message
    this.openSnackBar(notification, 'snack-error')
    this.router.navigateByUrl('/login')
  }

  pageNotFound(){
    this.clearToken()
    this.router.navigateByUrl('/not-found')
  }

  clearToken() {
    localStorage.removeItem('token')
  }

  openSnackBar(message, panelClass) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: message,
      panelClass: [panelClass],
      duration: 10000
    })
  }

  showErrorMessage(error: object){
    this.persistingData = false;
      let notification = errorMessage.ConnectionError(error)
      this.openSnackBar(notification, 'snack-error')
      return
  
  }

  newTab(link:string) {
    if(link.length==0){
      let notification = 'Invalid Url'
      this.openSnackBar(notification, 'snack-error')
      return
    }
    window.open(
      link,
      '_blank' // <- This is what makes it open in a new window or tab.
    );
  }


  goBack() {
    this._location.back()
  }

  ngOnDestroy() {
    if(!this.subscription){return}
    this.subscription.unsubscribe();
  }

}
