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
  selector: 'app-innovate',
  templateUrl: './innovate.component.html',
  styleUrls: ['./innovate.component.css']
})
export class InnovateComponent implements OnInit {

  persistingData: boolean;
  isConnecting: boolean
  user: object;
  hasError: boolean;
  firstFormGroup: FormGroup;
  programmeDurations = []
  keyRole = 88;
  optionalRole = 99;
  numberArray= []
  subscription: Subscription
  overview: object
  cutOff = 50

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
    this.validateUser()
    this.fetchCustomData()
  }

  validateUser(){
    this.isConnecting= true
    const subscription = this.userService.validateUser()
    this.subscription = subscription.subscribe(
      (res)=>{
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

  fetchCustomData(){
    this.isConnecting = true
    const subscription = this.userService.fetchInnovateSettings();
    this.subscription = subscription
    .subscribe(
      (res)=>{
        if(res.code == 200) {
          if(!res.body || res.body.idea_cut_off==0 || res.body.maximum_mentee==0) {
            this.gotoSettings() 
            return
          }
          this.manipulateSettings(res.body)
        } else {
          this.hasError = true;
          this.isConnecting = false;
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
    if(!data) {
      this.isConnecting = false;
      return
    }
    if(data['idea_cut_off']>0) {
      this.cutOff = data['idea_cut_off']
    }
    this.fetchSystemOverview()
  }


  fetchSystemOverview(){
    this.isConnecting = true
    const subscription = this.userService.systemOverview();
    this.subscription = subscription
    .subscribe(
      (res)=>{
        if(res.code == 200) {
         this.manipulateOverview(res.body)
        } else {
          this.hasError = true
          this.isConnecting = false;
        }
    },
    (error)=>{
      this.isConnecting = false;
        this.hasError = true;
        let notification = errorMessage.ConnectionError(error);
        this.openSnackBar(notification, 'snack-error');
    });
  }
 
  manipulateOverview(data: any) {
    if(!data) {
      this.isConnecting = false;
      return
    }
    this.overview =data
    this.overview['top'] = []
    this.overview['ideas'] = []
    if(data.mentees) {
      data.mentees.forEach(mentee => {
        if(mentee.ideas) {   
        this.pushMenteeIdeas(mentee.ideas)
        }
      });
    } else {
      data['mentees'] = []
    }

    if(!data.mentors) {
     data.mentors = []
    }

    if(!data.committees) {
      data.committees = []
     }
    
    this.isConnecting = false;
  }

  pushMenteeIdeas(idea: object[]) {
    if(!idea) {
      return
    }
    idea.forEach(x=> {
      if(x['committee_status']=='approved') {
        this.overview['ideas'].push(x)
      }
      if(x['committee_score']>this.cutOff) {
        this.overview['top'].push(x)
      }
    });
    this.isConnecting = false
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


   logUserOut(message:string){
    this.clearToken()
    let notification = message
    this.openSnackBar(notification, 'snack-error')
    this.router.navigateByUrl('/login')
  }

  gotoSettings(){
    this.router.navigateByUrl('/innovate/admin')
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
