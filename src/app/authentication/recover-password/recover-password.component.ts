import { Component, OnInit } from '@angular/core';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/shared/authentication/login.service';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Subscription } from 'rxjs';
import {Location} from '@angular/common';


@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {

  hidePassword= true;
  persistingData: boolean;
  subscription: Subscription;

  constructor(
    private snackBar: MatSnackBar, 
    private titleService:Title,
    private loginService: LoginService,
    private location: Location
    ) { }

  ngOnInit() {
    this.titleService.setTitle('SMEHUB|Recover Password')
  }

  email = new FormControl('', [Validators.required, Validators.maxLength(100) ]);

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'Email is required' :
        this.email.hasError('maxlength') ? 'Maximum length is 100' :
            '';
  }


  


onSubmit(){
  if(this.email.invalid){
    let notification = "You have errors in your form"
    this.openSnackBar(notification, 'snack-error')
    return
  } 

  let data ={
    "email": this.email.value.trim(),
  }
  
  this.persistData(data)

}

persistData(data: Object){
  this.persistingData = true;
  const subscription = this.loginService.recovery(data)
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

  openSnackBar(message, panelClass) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: message,
      panelClass: [panelClass],
      duration: 4000
    })
  }

  clearForm() {
    this.email.setValue('');
  }

  goBack(){
    this.location.back();
  }

}
