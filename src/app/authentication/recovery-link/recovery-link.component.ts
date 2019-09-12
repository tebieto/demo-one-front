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

let showConfirmError= false

@Component({
  selector: 'app-recovery-link',
  templateUrl: './recovery-link.component.html',
  styleUrls: ['./recovery-link.component.css']
})
export class RecoveryLinkComponent implements OnInit {

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
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    this.titleService.setTitle('IDEAHUB|Recover Password')
    this.startCustomRouter()
  }

  password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
  confirm_password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]);

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? 'Password is required' :
        this.password.hasError('minlength') ? 'Minimum length is 6' :
        this.password.hasError('maxlength') ? 'Maximum length is 20' :
            '';
  }


  getConfirmPasswordErrorMessage() {

    if (this.confirm_password.value != this.password.value){
    showConfirmError = true;
    return 'Password and Confirm password does not match';
    }

    showConfirmError = false
  }


onSubmit(){
  if(this.password.invalid || this.confirm_password.invalid || showConfirmError==true){
    let notification = "You have errors in your form"
    if(showConfirmError==true){
      notification = "Passwords do not match"
    }
    this.openSnackBar(notification, 'snack-error')
    return
  } 

  let data ={
    "password": this.password.value.trim(),
    "confirm": this.confirm_password.value.trim(),
    "email": this.params['email'],
    "code": this.params['code']
  }
  
  this.persistData(data)

}


persistData(data: Object){
  if(this.persistingData){return}
  this.persistingData = true;
  const subscription = this.loginService.recover(data)
    this.subscription = subscription
    .subscribe(
      (res)=>{
        this.persistingData = false
      
      if(res.code != 200) {
        res['status']= res['code']
        this.showErrorMessage(res)
      }

      if(res.code==200) {
        let notification = res['body']
        this.openSnackBar(notification, 'snack-success')
        this.clearForm()
      }
    },
      (error)=>{
        this.persistingData = false
        
        let notification = errorMessage.ConnectionError(error)
        this.openSnackBar(notification, 'snack-error')
        return
      }
    );
}

showErrorMessage(error: object){
  this.persistingData = false;
    let notification = errorMessage.ConnectionError(error)
    this.openSnackBar(notification, 'snack-error')
    return

}


verifyCode(data: Object){
  this.isConnecting = true;
  const subscription = this.loginService.verifyCode(data)
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
      duration: 4000
    })
  }

  clearForm() {
    this.password.setValue('');
    this.confirm_password.setValue('');
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
    if(!params['email'] || !params['code']) {
      this.pageNotFound()
      return
    }

    let data = {
      "email": params['email'],
      "code": params['code']
    }

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
