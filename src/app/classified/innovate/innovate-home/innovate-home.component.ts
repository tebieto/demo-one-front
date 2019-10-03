import { Component, OnInit } from '@angular/core';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user/user.service';
import { Subscription } from 'rxjs';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';

@Component({
  selector: 'app-innovate-home',
  templateUrl: './innovate-home.component.html',
  styleUrls: ['./innovate-home.component.css']
})
export class InnovateHomeComponent implements OnInit {

  persistingData: boolean;
  isConnecting: boolean
  user: object;
  hasError: boolean;
  firstFormGroup: FormGroup;
  programmeDurations = []
  keyRole = 44;
  optionalRole = 44;
  numberArray= []
  subscription: Subscription

  constructor(
    private titleService:Title, 
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    ) {

   }

  ngOnInit() {
    this.titleService.setTitle('IDEAHUB|Admin')
    this.prepareFormInputValidation()
    this.numberArray = this.fillNumberArray(100)
    this.validateUser()
    this.fetchCustomData()
  }

  validateUser(){
    this.isConnecting= true
    const subscription = this.userService.validateUser()
    this.subscription = subscription.subscribe(
      (res)=>{
        this.isConnecting=false
        if(res.code != 200) {
          this.hasError = true
          let message ='Invalid Session, Login Again.'
          this.logUserOut(message);
        }
  
        if(res.code==200) {
          this.user = res.body.user
          this.inspectRole(res.body.role, 'match')
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }

  prepareFormInputValidation(){
    this.firstFormGroup = this.formBuilder.group({
      mentorMail: ['', [Validators.required, Validators.maxLength(500)]],
      menteeMail: ['', [Validators.required, Validators.maxLength(500)]],
      mentorWelcomeMail: ['', [Validators.required, Validators.maxLength(500)]],
      menteeWelcomeMail: ['', [Validators.required, Validators.maxLength(500)]],
      maxMentee: ['', [Validators.required]],
      minIdea: ['', [Validators.required]],
    });
   }

  onSubmit(){

    if(this.persistingData){return}
  
    if(this.firstFormGroup.invalid){
      let notification = "You have errors in your form"
      this.openSnackBar(notification, 'snack-error')
      return
    }

    let data ={
      "idea_cut_off": this.firstFormGroup.controls['minIdea'].value,
      "maximum_mentee": this.firstFormGroup.controls['maxMentee'].value,
      "mentee_mail": this.firstFormGroup.controls['menteeMail'].value,
      "mentee_registration_mail": this.firstFormGroup.controls['menteeWelcomeMail'].value,
      "mentor_mail": this.firstFormGroup.controls['mentorMail'].value,
      "mentor_registration_mail": this.firstFormGroup.controls['mentorWelcomeMail'].value,
    }
    
    this.persistData(data)
  
  }

  fetchCustomData(){
    this.isConnecting = true
    const subscription = this.userService.fetchInnovateSettings();
    this.subscription = subscription
    .subscribe(
      (res)=>{
        this.isConnecting = false;
        if(res.code == 200) {
          if(!res.body || res.body.idea_cut_off==0 || res.body.maximum_mentee==0) {return}
          this.manipulateSettings(res.body)
        } else {
          this.hasError = true
        }
    },
    (error)=>{
      this.isConnecting = false;
        this.hasError = true;
        let notification = errorMessage.ConnectionError(error);
        this.openSnackBar(notification, 'snack-error');
    });
  }

  manipulateSettings(data: object) {
    this.populateForm(data)
  }

  populateForm(data) {

        this.firstFormGroup.get('mentorMail').setValue(data.mentor_mail);
    
        this.firstFormGroup.get('mentorWelcomeMail').setValue(data.mentor_registration_mail);
  
        this.firstFormGroup.get('menteeMail').setValue(data.mentee_mail);
      
        this.firstFormGroup.get('menteeWelcomeMail').setValue(data.mentee_registration_mail);
      
        this.firstFormGroup.get('minIdea').setValue(data.idea_cut_off);
      
        this.firstFormGroup.get('maxMentee').setValue(data.maximum_mentee);
  }

  persistData(data: Object){
    this.persistingData = true;
    const subscription = this.userService.saveInnovateSettings(data);
    this.subscription = subscription
    .subscribe(
      (res)=>{
        this.persistingData = false;
        this.openSnackBar(res.body, 'snack-success')
    },
    (error)=>{
      this.persistingData = false;
      let notification = errorMessage.ConnectionError(error)
      this.openSnackBar(notification, 'snack-error')
  
    });
  }
  
  isForbidden(data:object) :void{
    if(data['code'] == 403) {
      this.hasError = true
      let message ='Forbidden Request, Login Again.'
      this.logUserOut(message);
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

  fillNumberArray(number: number) {
    let newArray = []
    for (let index = 1; index <= number; index++) {
      newArray.push(index)
    }
    return newArray
  }

  getMentorMailErrorMessage() {
    return this.firstFormGroup.controls['mentorMail'].errors.required ? 'Mentor Invite Mail is required' :
    this.firstFormGroup.controls['mentorMail'].errors.maxlength ? 'Maximum length is 500 characters' :
    '';
  }

  getMentorWelcomeMailErrorMessage() {
    return this.firstFormGroup.controls['mentorWelcomeMail'].errors.required ? 'Mentor Welcome Mail is required' :
    this.firstFormGroup.controls['mentorWelcomeMail'].errors.maxlength ? 'Maximum length is 500 characters' :
    '';
  }

  getMenteeMailErrorMessage() {
    return this.firstFormGroup.controls['menteeMail'].errors.required ? 'Mentee Invite Mail is required' :
    this.firstFormGroup.controls['menteeMail'].errors.maxlength ? 'Maximum length is 500 characters' :
    '';
  }

   getMenteeWelcomeMailErrorMessage() {
    return this.firstFormGroup.controls['menteeWelcomeMail'].errors.required ? 'Mentee Welcome Mail is required' :
    this.firstFormGroup.controls['menteeWelcomeMail'].errors.maxlength ? 'Maximum length is 500 characters' :
    '';
  }

  getMaxMenteeErrorMessage() {
    return this.firstFormGroup.controls['maxMentee'].errors.required ? 'This field is required' :
    '';
  }

  getMinIdeaErrorMessage() {
    return this.firstFormGroup.controls['minIdea'].errors.required ? 'This field is required' :
    '';
  }

  
   clearFormField(field: string){

    if(field=='mentorMail') {
      this.firstFormGroup.get('mentorMail').setValue("");
    }
    if(field=='mentorWelcomeMail') {
      this.firstFormGroup.get('mentorWelcomeMail').setValue("");
    }
    if(field=='menteeMail') {
      this.firstFormGroup.get('menteeMail').setValue("");
    }
    if(field=='menteeWelcomeMail') {
      this.firstFormGroup.get('menteeWelcomeMail').setValue("");
    }
    if(field=='maxMentee') {
      this.firstFormGroup.get('maxMentee').setValue("");
    }
    if(field=='minIdea') {
      this.firstFormGroup.get('minIdea').setValue("");
    }

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

  openSnackBar(message, panelClass) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: message,
      panelClass: [panelClass],
      duration: 10000
    })
  }

}
