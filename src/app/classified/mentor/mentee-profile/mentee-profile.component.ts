import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { MatSnackBar, MatDialog } from '@angular/material';
import { UserService } from 'src/app/shared/user/user.service';
import * as crypto from 'crypto-js';
import {CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';

@Component({
  selector: 'app-mentee-profile',
  templateUrl: './mentee-profile.component.html',
  styleUrls: ['./mentee-profile.component.css']
})
export class MenteeProfileComponent implements OnInit {

  user: object;
  isConnecting: boolean;
  hasError: boolean;
  params: object;
  profile: object;
  hasMentor: boolean;
  persistingData: boolean;
  overview = []

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
          this.getprofile(this.params['code'])
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }

  getprofile(param: string){
    let code = param
    let secret = this.makeSecret()
    let data = this.decrypt(code, secret)
    this.profile = data['value']
    this.getUserOverview(this.profile['id'])
  }

  getUserOverview(id: number){
    this.isConnecting= true
    this.userService.userOverview(id)
    .subscribe(
      (res)=>{
        if(res.code != 200) {
          this.hasError = true
          let message ='Invalid Session, Login Again.'
          this.logUserOut(message);
        }
  
        if(res.code==200) {
          this.manipulateOverview(res.body)
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }

  manipulateOverview(data: any) {
    data['approved'] = []
    data['certificates'] = []
    data['mentorCount'] = 0
    if(data['mentors']) {
      data['mentorCount'] = 1
    }
    data.ideas.forEach(idea => {
      if(idea['committee_status']=='approved') {
        data['approved'].push(idea)
      }
    });

    data.program_certificates.forEach(cert => {
      if(cert['status']=='approved') {
        data['certificates'].push(cert)
      }
    });
    
    this.overview =data
    this.isConnecting = false;
  }
  

  startCustomRouter(){
    this.route.params.subscribe(params=>{
          this.consumeRouteParams(params)
      });
  }

  consumeRouteParams(params: object) {
    this.params = params
    return
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


  goBack() {
    this._location.back()
  }


}
