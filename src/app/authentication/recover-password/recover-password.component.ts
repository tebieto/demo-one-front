import { Component, OnInit } from '@angular/core';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {

  hidePassword= true;

  constructor(private snackBar: MatSnackBar, private titleService:Title) { }

  ngOnInit() {
    this.titleService.setTitle('SMEHUB|Recover Password')
  }

  email = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20) ]);

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'Email is required' :
        this.email.hasError('minlength') ? 'Minimum length is 6' :
        this.email.hasError('maxlength') ? 'Maximum length is 20' :
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
