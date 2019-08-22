import { Component, OnInit } from '@angular/core';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { LoginService } from 'src/app/shared/authentication/login.service';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user/user.service';

@Component({
  selector: 'app-special-setup',
  templateUrl: './special-setup.component.html',
  styleUrls: ['./special-setup.component.css']
})
export class SpecialSetupComponent implements OnInit {

  hidePassword= true;
  persistingData: boolean;
  isConnecting: boolean
  user: object;
  hasError: boolean;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  programmeDurations = []

  constructor(private snackBar: MatSnackBar, 
    private titleService:Title, 
    private loginService: LoginService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    ) {

   }

  ngOnInit() {
    this.titleService.setTitle('SMEHUB|Mentor Quick Setup')
    //this.validateUser()
    this.prepareFormInputValidation()
    this.fetchProgrammeDuration()
  }

  fetchProgrammeDuration() {
    
    this.programmeDurations = []
    for (let index = 1; index <= 12; index++) {
      let data = {duration:''}
      let month = 'Month'
      if(index>1) {
        month = 'Months'
      }
      data.duration = index+' '+month
      this.programmeDurations.push(data)
    }
  }

  getAboutErrorMessage() {
    return this.firstFormGroup.controls['about'].errors.required ? 'About is required' :
    this.firstFormGroup.controls['about'].errors.minlength ? 'Minimum character is 10' :
    '';
  }

  getPhoneErrorMessage() {
    return this.firstFormGroup.controls['phone'].errors.required ? 'Phone is required' :
    this.firstFormGroup.controls['phone'].errors.minlength ? 'Minimum character is 10' :
    this.firstFormGroup.controls['phone'].errors.maxlength ? 'Maximum character is 11' :
    '';
  }

  getPnameErrorMessage() {
    return this.secondFormGroup.controls['pname'].errors.required ? 'Programme name is required' :
    this.secondFormGroup.controls['pname'].errors.minlength ? 'Minimum character is 3' :
    '';
  }

  getPdescriptionErrorMessage() {
    return this.secondFormGroup.controls['pdescription'].errors.required ? 'Programme description is required' :
    this.secondFormGroup.controls['pdescription'].errors.minlength ? 'Minimum character is 3' :
    '';
  }

  getPdurationErrorMessage() {
    return this.secondFormGroup.controls['pdescription'].errors.required ? 'Programme description is required' :
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

  if(this.firstFormGroup.invalid ){
    let notification = "You have errors in your form"
    this.openSnackBar(notification, 'snack-error')
    return
  } 

  let data ={
    "about": this.firstFormGroup.controls['about'].value.trim(),
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

prepareFormInputValidation(){
  this.firstFormGroup = this.formBuilder.group({
    phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],
    about: ['', [Validators.required, Validators.minLength(10)]]
  });

  this.secondFormGroup = this.formBuilder.group({
    pname: ['', [Validators.required, Validators.minLength(3)]],
    pdescription: ['', [Validators.required, Validators.minLength(3)]],
    pduration: ['', [Validators.required]]
  });
 }

 clearFormField(field: string){
  if(field=='phone') {
    this.firstFormGroup.get('phone').setValue("");
  }
  if(field=='pname') {
    this.secondFormGroup.get('pname').setValue("");
  }
  if(field=='pdescription') {
    this.secondFormGroup.get('pdescription').setValue("");
  }
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
