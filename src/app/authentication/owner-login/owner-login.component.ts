import { Component, OnInit } from '@angular/core';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/authentication/login.service';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Config } from 'src/app/config';

@Component({
  selector: 'app-owner-login',
  templateUrl: './owner-login.component.html',
  styleUrls: ['./owner-login.component.css']
})
export class OwnerLoginComponent implements OnInit {

  
  hidePassword= true;
  persistingData: boolean;

  constructor(
    private snackBar: MatSnackBar, 
    private titleService:Title,
    private router: Router,
    private loginService: LoginService
    ) { }

  ngOnInit() {
    this.titleService.setTitle('IDEAHUB|Login')
  }

  email = new FormControl('', [Validators.required ]);
  password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'Email is required' :
            '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'Password is required' :
        this.password.hasError('minlength') ? 'Minimum length is 6' :
        this.password.hasError('maxlength') ? 'Maximum length is 20' :
            '';
  }

  


  onSubmit(){
  if(this.password.invalid || this.email.invalid){
    let notification = "You have errors in your form"
    this.openSnackBar(notification, 'snack-error')
    return
  } 

  let data ={
    "username": this.email.value.trim(),
    "password": this.password.value.trim()
  }
  
  this.persistData(data)

}

persistData(data: Object){
  this.persistingData = true
  this.loginService.owner(data)
  .subscribe(
    (res)=>{
      this.persistingData = false
    
    if(res.code != 200) {
      res['status']= res['code']
      this.showErrorMessage(res)
    }

    if(res.code==200) {
     if (this.storeToken(res.token)){
       this.redirectUser(res.body.role)
     }
    }
  },
    (error)=>{
      this.persistingData = false
      
      let notification = errorMessage.ConnectionError(error)
    this.openSnackBar(notification, 'snack-error')
    return
    }
  )
}


storeToken(token: string){
    localStorage.setItem('token', token)
    document.cookie = 'token='+Config.bearer+''+token
    return true
}

redirectUser(role:any) {
  if(role[0]) {
    // It is an array
       this.redirectByArray(role)
       return
  } else if (role.code == 999){
    //Redirect to user page
    this.gotoOwnerPage()
    return
 
  }else {
    // User should not login
   this.loginNotAllowed()
  }
 
  return
 }
 
 redirectByArray(role: any){
   let isOwner = role.find(x=>{
     return x.code === 999
   })
 
 if(isOwner){
   this.gotoOwnerPage()
 } else {
   // User should not login
   this.loginNotAllowed()
 }
 }
 
 loginNotAllowed(){
   localStorage.removeItem('token')
   let notification = 'You are not allowed to view this page'
     this.openSnackBar(notification, 'snack-error')
     return
 
 }


gotoOwnerPage(){
  this.router.navigateByUrl('/owner/home')
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

}
