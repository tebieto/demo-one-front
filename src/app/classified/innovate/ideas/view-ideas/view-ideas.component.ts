import { Component, OnInit} from '@angular/core';
import { MatSnackBar, MatDialog} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/user/user.service';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { Location } from '@angular/common';
import {Asset as crypto} from 'src/app/asset';
import { SharedDialogComponent } from 'src/app/shared/shared-dialog/shared-dialog.component';
import { SharedScoreComponent } from 'src/app/shared/shared-score/shared-score.component';

@Component({
  selector: 'app-view-ideas',
  templateUrl: './view-ideas.component.html',
  styleUrls: ['./view-ideas.component.css']
})
export class ViewIdeasComponent implements OnInit {

  isConnecting: boolean;
  persistingData: boolean;
  subscription: Subscription;

  user: object;
  hasError: boolean;
  params: object;
  idea: object;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    public dialog: MatDialog,
    ) {}

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
          this.user = res.body.user
          this.decodeIdea(this.params['code'], this.user['id'])
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }

  onApproveMessage(idea: object) {
    let data = idea
    let message = 'Sure you want to approve Idea with title: "' + idea['title']+ '"?';
    let msg = 'Briefly tell us why you want to approve this Idea';
    this.openSheet(data, message, msg, 'approve')
  }

  onRejectMessage(idea: object) {
    let data = idea
    let message = 'Sure you want to reject Idea with title: "' + idea['title']+ '"?';
    let msg = 'Briefly tell us why you want to reject this Idea';
    this.openSheet(data, message, msg, 'reject')
  }



  openSheet(data: object, message, msg:string, type: string): void {
    let scoreMessage = "Grade this Idea over 100"
    const dialogRef = this.dialog.open(SharedScoreComponent, {
      width: '400px',
      data: {id:data['id'], message:msg, scoreMessage: scoreMessage}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        return
      }
      if(type=='approve') {
        this.onApprove(data, result)
      } else if(type=='reject') {
        this.onReject(data, result)
      }
    });
  }


  onApprove(idea: object, sheetData: object) :void{
    let message = 'Sure you want to approve Idea with title: "' + idea['title']+ '"?'
    this.openDialog(idea, message, sheetData, 'approve')
  }

  onReject(idea: object, sheetData: object) :void{
    let message = 'Sure you want to reject Idea with title: "' + idea['title']+ '"?'
    this.openDialog(idea, message, sheetData, 'reject')
  }

  openDialog(data: object, message, sheetData, type: string): void {
    const dialogRef = this.dialog.open(SharedDialogComponent, {
      width: '250px',
      data: {id:data['id'], message:message}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        return
      }
      if(type=='approve') {   
        this.approveIdea(data['id'], sheetData)
      } else if(type=='reject') {
        this.rejectIdea(data['id'], sheetData)
      }
    });
  }

  approveIdea(id: number, sheetData: object) {
    let data = {id: id, committee_comment: sheetData['msg'], committee_score: sheetData['score'] }
    this.persistingData = true
    this.userService.committeeApproveIdea(data)
    .subscribe(
      (res)=>{
        this.persistingData=false
        if(res.code != 200) {
          this.hasError = true
          this.showErrorMessage(res)
        }
  
        if(res.code==200) {
          this.idea['committee_status'] = 'approved';
          let notification = res.body
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

  rejectIdea(id: number, sheetData: object) {
    let data = {id: id, committee_comment: sheetData['msg'], committee_score: sheetData['score'] }
    this.persistingData = true
    this.userService.committeeRejectIdea(data)
    .subscribe(
      (res)=>{
        this.persistingData=false
        if(res.code != 200) {
          this.hasError = true
          this.showErrorMessage(res)
        }
  
        if(res.code==200) {
          this.idea['committee_status'] = 'rejected';
          let notification = res.body;
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


  decodeIdea(code:string, secret: string) {
   let idea = crypto.decrypt(code, secret)
   this.idea = idea['value']
   if(this.idea['title'].length>50) {
     this.idea['shortTitle'] = this.idea['title'].slice(0,50)+'...'
   } else {
    this.idea['shortTitle'] = this.idea['title']
   }
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

  startCustomRouter(){
    this.route.params.subscribe(params=>{
          this.consumeRouteParams(params)
      });
  }

  consumeRouteParams(params: object) {
    
    if(params['code']) {
       this.params = params
    }  else {
      this.pageNotFound()
    }

  }

  showErrorMessage(error: object){
    this.persistingData = false;
      let notification = errorMessage.ConnectionError(error)
      this.openSnackBar(notification, 'snack-error')
      return
  
  }

  goBack() {
    this._location.back()
  }

  newTab(link:string) {
    window.open(
      link,
      '_blank' // <- This is what makes it open in a new window or tab.
    );
  }


ngOnDestroy() {
  if(!this.subscription){return}
  this.subscription.unsubscribe();
}


}
