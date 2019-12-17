import { Component, OnInit } from '@angular/core';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/shared/authentication/login.service';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Subscription } from 'rxjs';
import {Location} from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterService } from 'src/app/shared/authentication/register.service';
import { Config } from 'src/app/config';

let showConfirmError= false

@Component({
  selector: 'app-special-registration',
  templateUrl: './special-registration.component.html',
  styleUrls: ['./special-registration.component.css']
})
export class SpecialRegistrationComponent implements OnInit {

  hidePassword= true;
  hideConfirm = true;
  isConnecting = true;
  persistingData: boolean;
  subscription: Subscription;
  hasError:boolean;
  params: object;

  constructor(
    private snackBar: MatSnackBar, 
    private titleService:Title,
    private loginService: LoginService,
    private registerService: RegisterService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    this.titleService.setTitle('IDEAHUB|Registration')
    this.startCustomRouter()
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  username = new FormControl('', [Validators.required, Validators.pattern(/^([a-zA-Z0-9]?[a-zA-z_])+([.]?[a-zA-Z0-9_]+)*$/)]);
  password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
  confirm_password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
  full_name = new FormControl('', [Validators.required]);

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'Email is required' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'Password is required' :
        this.password.hasError('minlength') ? 'Minimum length is 6' :
        this.password.hasError('maxlength') ? 'Maximum length is 20' :
            '';
  }

  getUsernameErrorMessage() {

    return this.username.hasError('required') ? 'Username is required' :
        this.username.hasError('minlength') ? 'Minimum length is 6' :
        this.username.hasError('maxlength') ? 'Maximum length is 20' :
        this.username.hasError('pattern') ? 'Only Alphabet and Number usernames are allowed' :
        '';
  }
  
  getConfirmPasswordErrorMessage() {

    if (this.confirm_password.value != this.password.value){
    showConfirmError = true;
    return 'Password and Confirm password does not match';
    }

    showConfirmError = false
  }

  getFullNameErrorMessage() {
    return this.full_name.hasError('required') ? 'Full Name is required' :
        this.full_name.hasError('minlength') ? 'Minimum length is 3' :
        this.full_name.hasError('maxlength') ? 'Maximum length is 100' :
            '';
  }


  onSubmit(){

      
  if(this.password.invalid || this.email.invalid || this.full_name.invalid || this.username.invalid || showConfirmError){
    let notification = "You have errors in your form"

    if(showConfirmError) {
      notification = "Passwords did not match"
    }

    this.openSnackBar(notification, 'snack-error')
    return
  } 

  let data ={
    "email": this.params['email'],
    "password": this.password.value.trim(),
    "confirmation": this.confirm_password.value.trim(),
    "username": this.username.value.trim(),
    "full_name": this.full_name.value,
    "role": this.params['role']
  }

  this.persistData(data)



  }

  persistData(data: Object){
    this.persistingData = true
    const subscription = this.registerService.newUser(data)
    this.subscription = subscription
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
    document.cookie = "token="+token+'; domain=my-gpi.com';
    return true
  }


  redirectUser(role:any) {
    if(role.code == 88) {
      // It is an array
      this.gotoAdminPage()
      return
    } else if (role.code == 77){
      //Redirect to user page
      this.gotoCommitteePage()
      return
    } else if (role.code == 66){
      //Redirect to user page
      this.gotoMentorPage()
      return
    } else if (role.code == 55){
      //Redirect to user page
      this.gotoMenteePage()
      return
    } else if (role.code == 44){
      //Redirect to user page
      this.gotoInnovatePage()
      return
    }else {
      // User should not login
     this.loginNotAllowed()
    }
   
    return
   }

  gotoMenteePage(){
    this.router.navigateByUrl('/mentee/home')
    let notification = "Logged In as a Mentee";
    this.openSnackBar(notification, 'snack-success')
  }

  gotoInnovatePage(){
    this.router.navigateByUrl('/innovate')
    let notification = "Logged In as an Administrator";
    this.openSnackBar(notification, 'snack-success')
  }

  gotoMentorPage(){
    this.router.navigateByUrl('/mentor/home')
    let notification = "Logged In as a Mentor";
    this.openSnackBar(notification, 'snack-success')
  }

  gotoCommitteePage(){
    this.router.navigateByUrl('/committee/home')
    let notification = "Logged In as a Committee member";
    this.openSnackBar(notification, 'snack-success')
  }

  gotoAdminPage(){
    this.router.navigateByUrl('/innovate')
    let notification = "Logged In as an Administrator";
    this.openSnackBar(notification, 'snack-success')
  }
   
   
  loginNotAllowed(){
    localStorage.removeItem('token')
    let notification = 'You are not allowed to view this page'
      this.openSnackBar(notification, 'snack-error')
      return
  }

 

getRoleString(role: number) :string{
  
  if(role==88) {
    return 'an Administrator'
  } else if(role==77) {
    return 'a Committee Member'
  } else if(role==66) {
    return 'a Mentor'
  } else if(role==55) {
    return 'a Mentee'
  } else if(role==44) {
    return 'an Innovate Administrator'
  } else {
    return ''
  }
}

refillEmail() {
  this.email.setValue(this.params['email'])
}


showErrorMessage(error: object){
    this.persistingData = false;
    let notification = errorMessage.ConnectionError(error)
    this.openSnackBar(notification, 'snack-error')
    return
}


verifyCode(data: Object){
  this.isConnecting = true;
    const subscription = this.loginService.verifyInviteCode(data)
    this.subscription = subscription
    .subscribe(
      (res)=>{
      if(res.code != 200) {
        let notification = res['body']
        this.openSnackBar(notification, 'snack-error')
        this.pageNotFound()
      }

      if(res.code==200) {
        this.isConnecting = false
        this.populateForm(res['special'])
      }
    },
      (error)=>{
        this.isConnecting = false
        this.hasError = true
      }
    );
}

  openSnackBar(message, panelClass) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: message,
      panelClass: [panelClass],
      duration: 2000
    })
  }

  clearForm() {
    this.email.setValue('')
    this.username.setValue('')
    this.full_name.setValue('')
    this.password.setValue('');
    this.confirm_password.setValue('');
  }

  populateForm(params: object) {
    this.email.setValue(params['email'])
    this.full_name.setValue(params['full_name'])
  }

  goBack(){
    this.location.back();
  }

  startCustomRouter(){
    this.route.params.subscribe(params=>{
          this.consumeRouteParams(params)
      });
  }

  consumeRouteParams(params: object) {
    if(!params['email'] || !params['role'] || !params['code']) {
      this.pageNotFound();
      return
    }

    let role = parseInt(params['role'])

    let data = {
      "email": params['email'],
      "role": role,
      "code": params['code']
    }

    data['roleString']=this.getRoleString(role)
    this.params = data;

    this.verifyCode(data);
  }

  pageNotFound(){
    this.router.navigateByUrl('/not-found')
  }

  ngOnDestroy(): void {
    
    if(!this.subscription) {return}
    this.subscription.unsubscribe();
  }


}
