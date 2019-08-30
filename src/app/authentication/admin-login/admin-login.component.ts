import { Component, OnInit } from '@angular/core';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { LoginService } from 'src/app/shared/authentication/login.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  hidePassword= true;
  persistingData: boolean;

  constructor(
    private snackBar: MatSnackBar, 
    private titleService:Title,
    private router: Router,
    private loginService: LoginService
    ) { }

  ngOnInit() {
    this.titleService.setTitle('SMEHUB| Admin Login')
  }

  email = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20) ]);
  password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'Email is required' :
        this.email.hasError('minlength') ? 'Minimum length is 6' :
        this.email.hasError('maxlength') ? 'Maximum length is 20' :
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
  this.loginService.admin(data)
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
  return true
}

redirectUser(role:any) {
  if(role[0]) {
    // It is an array
       this.redirectByArray(role)
       return
  } else if (role.code == 99 || role.code == 88){
    //Redirect to user page
    this.gotoAdminPage()
    return
 
  }else {
    // User should not login
   this.loginNotAllowed()
  }
 
  return
 }
 
 redirectByArray(role: any){
   let isSuperAdmin = role.find(x=>{
     return x.code === 99
   })

   let isSubAdmin = role.find(x=>{
    return x.code === 88
  })
 
 if(isSubAdmin || isSuperAdmin){
   this.gotoAdminPage()
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


gotoAdminPage(){
  this.router.navigateByUrl('/admin/home')
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
