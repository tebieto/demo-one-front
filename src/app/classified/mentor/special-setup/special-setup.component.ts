import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user/user.service';
import { Config } from 'src/app/config';
import {MatChipInputEvent} from '@angular/material/chips';

export interface Specialisation {
  name: string;
}

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
  keyRole = 66;
  optionalRole = 66;


  // For Chips
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  specialisations: Specialisation[] = [
  ];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.specialisations.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
 
  stringifyArray(array:object[],seperator: string) {
    let string = '';

    array.forEach(obj=> {
      string+= obj['name']+', '
    });

    return string
  }

  remove(fruit: Specialisation): void {
    const index = this.specialisations.indexOf(fruit);

    if (index >= 0) {
      this.specialisations.splice(index, 1);
    }
  }

  // End of for Chips

  constructor(private snackBar: MatSnackBar, 
    private titleService:Title, 
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    ) {

   }

  ngOnInit() {
    this.titleService.setTitle('IDEAHUB|Mentor Quick Setup')
    this.validateUser()
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

  getLinkedInErrorMessage() {
    return this.firstFormGroup.controls['linkedin'].errors.required ? 'LinkedIn Url is required' :
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
          this.inspectRole(res.body.role, 'match')
          this.user = res.body.user
          this.verifyMentorSetup()
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

  if(this.firstFormGroup.invalid || this.secondFormGroup.invalid){
    let notification = "You have errors in your form"
    this.openSnackBar(notification, 'snack-error')
    return
  }
  
  if(this.specialisations.length==0) {
    let notification = "Specialisation is required"
    this.openSnackBar(notification, 'snack-error')
    return 
  }

  let data ={
    "about_me": this.firstFormGroup.controls['about'].value,
    "phone_number": this.firstFormGroup.controls['phone'].value,
    "linkedin": this.firstFormGroup.controls['linkedin'].value,
    "programme_name": this.secondFormGroup.controls['pname'].value,
    "description": this.secondFormGroup.controls['pdescription'].value,
    "duration": this.secondFormGroup.controls['pduration'].value,
    "e_learn": Config.menteeLearn,
    'specialisation': this.stringifyArray(this.specialisations, ',')
  }
  
  this.persistData(data)

}

persistData(data: Object){
  console.log(data)
  this.persistingData = true
  this.userService.saveMentorSetup(data)
  .subscribe(
    (res)=>{
      console.log(res)
      this.persistingData = false
      if(res.code != 200) {
        res['status']= res['code']
        this.hasError = true
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

verifyMentorSetup(){
  this.isConnecting = true
  this.userService.verifyMentorSetup()
  .subscribe(
    (res)=>{
      this.isConnecting = false
      if(res.code != 200) {
        res['status']= res['code']
        this.hasError = true
        this.showErrorMessage(res)
      }

      if(res.code==200) {
       if(res.status==true){
         this.gotoMentorPage()
       }
      }

  },
  (error)=>{
    this.isConnecting = false
    this.hasError = true
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
    about: ['', [Validators.required, Validators.minLength(10)]],
    linkedin: ['', [Validators.required]]
  });

  this.secondFormGroup = this.formBuilder.group({
    pname: ['', ],
    pdescription: ['', ],
    pduration: ['', ]
  });
 }

 clearFormField(field: string){
  if(field=='phone') {
    this.firstFormGroup.get('phone').setValue("");
  }

  if(field=='about') {
    this.firstFormGroup.get('about').setValue("");
  }

  if(field=='pname') {
    this.secondFormGroup.get('pname').setValue("");
  }
  if(field=='pdescription') {
    this.secondFormGroup.get('pdescription').setValue("");
  }

  if(field=='linkedin') {
    this.firstFormGroup.get('linkedin').setValue("");
  }
 }

 inspectRole(role: any, type: string) {
  if(role[0]) {
    // It is an array
    this.inspectRoleArray(role, type)
  } else if ((role.code == this.keyRole || role.code == this.optionalRole) && type=="unmatch"){
    let message ='Invalid Session, Login Again.'
    this.logUserOut(message);
  } else if ((role.code != this.keyRole && role.code != this.optionalRole) && type=="match"){
    let message ='Invalid Session, Login Again.'
    this.logUserOut(message);
  } 
}
 
 inspectRoleArray(role: any, type:string){
   let isKey = role.find(x=>{
     return x.code === this.keyRole
   });

   let isOptional = role.find(x=>{
      return x.code === this.optionalRole
    })
 
  if((isKey || isOptional) && type == 'unmatch'){
    let message ='Invalid Session, Login Again.'
    this.logUserOut(message);
  } else if((!isKey && !isOptional) && type == 'match'){
    let message ='Invalid Session, Login Again.'
    this.logUserOut(message);
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
