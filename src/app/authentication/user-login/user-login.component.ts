import { Component, OnInit } from '@angular/core';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/shared/authentication/login.service';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Router } from '@angular/router';
import { Config as config} from 'src/app/config';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
  providers: [LoginService]
})

export class UserLoginComponent implements OnInit {

  isPublic = config.isPublic
  hidePassword= true;
  persistingData: boolean;

  constructor(private snackBar: MatSnackBar, 
    private titleService:Title, 
    private loginService: LoginService,
    private router: Router
    ) {

   }

  ngOnInit() {
    this.titleService.setTitle('SMEHUB|Login')
  }

  email = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100) ]);
  password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'Email is required' :
        this.email.hasError('minlength') ? 'Minimum length is 6' :
        this.email.hasError('maxlength') ? 'Maximum length is 100' :
            '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'Password is required' :
        this.password.hasError('minlength') ? 'Minimum length is 6' :
        this.password.hasError('maxlength') ? 'Maximum length is 20' :
            '';
  }

  


  onSubmit(){

  if(this.persistingData){return}

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
  this.loginService.user(data)
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
    this.persistingData = false;
    let notification = errorMessage.ConnectionError(error)
    this.openSnackBar(notification, 'snack-error')
    return

  });
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
 } else if (role.code == 55){
   //Redirect to user page
   this.gotoMenteePage()
   return

 }else if (role.code == 88 || role.code == 77 || role.code == 66){
  //Redirect to classified page
  this.gotoClassifiedPage()
  return

} else if(role.code == 55) {
  this.gotoMenteePage()
} else {
   // User should not login
  this.loginNotAllowed()
 }

 return
}

redirectByArray(role: any){
  let isAdmin = role.find(x=>{
    return x.code === 88
  })

  let isCommittee = role.find(x=>{
    return x.code === 77
  })

  let isMentor = role.find(x=>{
    return x.code === 66
  })

  let isMentee = role.find(x=>{
    return x.code === 55
  })

if(isAdmin || isCommittee || isMentor){
  // go to classified user page
  this.gotoClassifiedPage()
} else if(isMentee) {
  //gotoMenteePage
  this.gotoMenteePage()
}  else {
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

gotoClassifiedPage(){
  this.router.navigateByUrl('/classified')
}

gotoUserPage(){
  this.router.navigateByUrl('/user/home')
}

gotoMenteePage(){
  this.router.navigateByUrl('/mentee')
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
