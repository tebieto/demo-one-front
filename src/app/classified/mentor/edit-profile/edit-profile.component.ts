import { Component, OnInit } from '@angular/core';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/shared/authentication/login.service';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  hidePassword= true;
  persistingData: boolean;
  isConnecting: boolean
  user: object;
  hasError: boolean;

  constructor(private snackBar: MatSnackBar, 
    private titleService:Title, 
    private loginService: LoginService,
    private userService: UserService,
    private router: Router,
    private _location: Location
    ) {

   }

  ngOnInit() {
    this.titleService.setTitle('SMEHUB|Mentor Quick Setup')
    this.validateUser()
  }

  about = new FormControl('', [Validators.required, Validators.minLength(6)]);

  email = new FormControl('', [Validators.required, Validators.email]);
  username = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20), Validators.pattern(/^([a-zA-Z0-9]?[a-zA-z_])+([.]?[a-zA-Z0-9_]+)*$/)]);
  password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
  confirm_password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
  full_name = new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'Email is required' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  getUsernameErrorMessage() {

    return this.username.hasError('required') ? 'Username is required' :
        this.username.hasError('minlength') ? 'Minimum length is 6' :
        this.username.hasError('maxlength') ? 'Maximum length is 20' :
        this.username.hasError('pattern') ? 'Only Alphanumeric usernames are allowed' :
        '';
  }
  

  getFullNameErrorMessage() {
    return this.full_name.hasError('required') ? 'Full Name is required' :
        this.full_name.hasError('minlength') ? 'Minimum length is 3' :
        this.full_name.hasError('maxlength') ? 'Maximum length is 100' :
            '';
  }

  getAboutErrorMessage() {
    return this.about.hasError('required') ? 'Email is required' :
        this.about.hasError('minlength') ? 'Minimum length is 6' :
            '';
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
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }

  logUserOut(message:string){
    this.clearToken()
    let notification = message
    this.openSnackBar(notification, 'snack-error')
    this.router.navigateByUrl('/login')
  }

  clearToken() {
    localStorage.removeItem('token')
  }

  onSubmit(){

  if(this.persistingData){return}

  if(this.about.invalid ){
    let notification = "You have errors in your form"
    this.openSnackBar(notification, 'snack-error')
    return
  } 

  let data ={
    "about": this.about.value.trim(),
  }
  
  this.persistData(data)

}

persistData(data: Object){
  this.persistingData = true
  this.loginService.user(data)
  .subscribe(
    (res)=>{
      this.persistingData = false
      if(res.code != 200) {
        res['status']= res['code']
        this.showErrorMessage(res)
      }

      if(res.code==200) {
       this.gotoMentorPage()
      }

  },
  (error)=>{
    this.persistingData = false;
    let notification = errorMessage.ConnectionError(error)
    this.openSnackBar(notification, 'snack-error')
    return

  });
}


gotoMentorPage(){
  this.router.navigateByUrl('/mentor/home')
}

showErrorMessage(error: object){
  this.persistingData = false;
    let notification = errorMessage.ConnectionError(error)
    this.openSnackBar(notification, 'snack-error')
    return

}

  openSnackBar(message, panelClass) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: message,
      panelClass: [panelClass],
      duration: 2000
    })
  }

  goBack() {
    this._location.back()
  }


}
