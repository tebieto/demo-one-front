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

let showConfirmError= false

@Component({
  selector: 'app-special-login',
  templateUrl: './special-login.component.html',
  styleUrls: ['./special-login.component.css']
})
export class SpecialLoginComponent implements OnInit {

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
    this.titleService.setTitle('SMEHUB|Registration')
    this.startCustomRouter()
  }

  email = new FormControl('', [Validators.required, Validators.email]);

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'Email is required' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  

  onSubmit(){

  if(this.persistingData == true) {return}
      
  if(this.email.invalid){
    let notification = "You have errors in your form"
    this.openSnackBar(notification, 'snack-error')
    return
  } 

  let data ={
    "email": this.params['email'],
    "role": this.params['role'],
    "code": this.params['code']
  }

  this.persistData(data)



  }

  persistData(data: Object){
    this.persistingData = true
    const subscription = this.loginService.acceptInvite(data)
    this.subscription = subscription
    .subscribe(
      (res)=>{
        this.persistingData = false
      
      if(res.code != 200) {
        res['status']= res['code']
        this.openSnackBar(res.body, 'snack-error')
      }

      if(res.code==200) {
      this.gotoLoginPage()
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

  
  
  gotoLoginPage(){
    this.router.navigateByUrl('/login')
    let notification = "Invitation Accepted";
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
      duration: 6000
    })
  }

  clearForm() {
    this.email.setValue('')
  }

  populateForm(params: object) {
    this.email.setValue(params['email'])
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
