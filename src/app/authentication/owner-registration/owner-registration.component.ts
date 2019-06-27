import { Component, OnInit } from '@angular/core';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { MatSnackBar, ErrorStateMatcher } from '@angular/material';
import { Title } from '@angular/platform-browser';


let showConfirmError= false

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
   
  // return !!(control && control.invalid && (control.dirty || control.touched || passwordMismatch));
    return !!(showConfirmError);
   
  }
}

@Component({
  selector: 'app-owner-registration',
  templateUrl: './owner-registration.component.html',
  styleUrls: ['./owner-registration.component.css']
})
export class OwnerRegistrationComponent implements OnInit {

  
  hasString = /^[a-zA-Z]+$/;
  usernameRegex = /^[a-zA-Z0-9_]+$/;
  hideConfirm = true;
  hidePassword = true;
  

  matcher = new MyErrorStateMatcher();

  constructor(private snackBar: MatSnackBar, private titleService:Title) { }

  ngOnInit() {
    this.titleService.setTitle('SMEHUB|Admin Registration')
  }


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
        this.username.hasError('pattern') ? 'Only Alphanumeric usernames are allowed' :
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
    this.openSnackBar(notification, 'snack-error')
    return
  } 
  let data ={
    "email": this.email.value.trim(),
    "password": this.password.value.trim(),
    "confirmation": this.confirm_password.value.trim(),
    "username": this.username.value.trim(),
    "full_name": this.full_name.value
  }

  this.persistData(data)



  }

  persistData(data: Object){
    console.log(data)
  }

  openSnackBar(message, panelClass) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: message,
      panelClass: [panelClass],
      duration: 2000
    })
  }

}
