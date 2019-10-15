import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { MatSnackBar, MatDialog } from '@angular/material';
import { UserService } from 'src/app/shared/user/user.service';
import {CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  user: object;
  isConnecting: boolean;
  hasError: boolean;
  profile: object;
  hasMentor: boolean;
  persistingData: boolean;
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
          this.getprofile(this.user)
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }


  getprofile(param: object){
    this.profile = param
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


  goBack() {
    this._location.back()
  }

}
