import { Component, OnInit } from '@angular/core';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user/user.service';

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
    if(field=='maxMentor') {
      this.firstFormGroup.get('maxMentor').setValue("");
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
