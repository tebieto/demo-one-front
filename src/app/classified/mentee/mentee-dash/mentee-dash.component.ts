import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatDialog, MatBottomSheet } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/user/user.service';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import * as crypto from 'crypto-js';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Title } from '@angular/platform-browser';
import { SharedDialogComponent } from 'src/app/shared/shared-dialog/shared-dialog.component';
import { SharedMessageDialogComponent } from 'src/app/shared/shared-message-dialog/shared-message-dialog.component';
import { Config } from 'src/app/config';

export interface PeriodicElement {
  'name': object;
  'about': string;
  'data': string;
}


@Component({
  selector: 'app-mentee-dash',
  templateUrl: './mentee-dash.component.html',
  styleUrls: ['./mentee-dash.component.css']
})
export class MenteeDashComponent implements OnInit {
  
  mentorList: PeriodicElement[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('sharedAvatar') sharedAvatar: ElementRef;
  displayedColumns: string[] = ['name', 'about', 'data'];
  dataSource = new MatTableDataSource(this.mentorList);
  learnUrl = Config.menteeLearn
  pendingMentor: boolean;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isConnecting: boolean;
  onStartUpload: boolean;
  persistingData: boolean;
  subscription: Subscription;
  hasMentor: boolean;

  user: object;
  hasError: boolean;
  keyRole = 55;
  optionalRole = 55;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private titleService:Title,
    public dialog: MatDialog,
    private _bottomSheet: MatBottomSheet
    ) {}

  ngOnInit() {
    this.titleService.setTitle('IDEAHUB|Mentee Home')
    this.validateUser()
    this.startPaginator()
    this.startCustomRouter()
  }

  chooseMentor(param: string) {
    let code = param
    let secret = this.makeSecret()
    let data = this.decrypt(code, secret)
    let message = 'Are you sure you want to make '+ data['value']['mentor']['full_name']+' your Mentor?';
    let msg = 'Briefly tell us why you want '+ data['value']['mentor']['full_name']+' to be your Mentor'
    this.openSheet(data.value, message, param, msg)
  }



  openSheet(data: object, message, param:string, msg:string): void {
    const dialogRef = this.dialog.open(SharedMessageDialogComponent, {
      width: '400px',
      data: {id:data['mentor']['id'], message:msg}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        return
      }
      this.openDialog(data, message, param, result)
    });
  }

  openDialog(data: object, message, param:string, msg): void {
    const dialogRef = this.dialog.open(SharedDialogComponent, {
      width: '250px',
      data: {id:data['mentor']['id'], message:message}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        return
      }
      this.addMentor(result, param, msg)
    });
  }

  addMentor(id: number, param:string, message: string) {
    let data = {
      'mentor_id': id,
      'mentee_message': message
    }
    this.persistingData = true
    this.userService.addMentor(data)
    .subscribe(
      (res)=>{
        this.persistingData=false
        if(res.code != 200) {
          this.hasError = true
          this.showErrorMessage(res)
        }
  
        if(res.code==200) {
          this.pendingMentor = true
          this.displayNewMentor(param)
          let notification = res.message
          this.openSnackBar(notification, 'snack-success')
         }
  
    },
    (error)=>{
      this.hasError = true
      this.persistingData = false
      let notification = errorMessage.ConnectionError(error)
      this.openSnackBar(notification, 'snack-error')
    });

  }

  displayNewMentor(param: string){
    let newMentor =  this.mentorList.find(x=> {
      return x.data == param
    });

    this.mentorList.splice(0, this.mentorList.length)
    this.mentorList.push(newMentor)
    this.startPaginator()
  }

  encrypt(value : object) : string{
    let secret = this.makeSecret()
    let d = {secret: secret, value: value}

    let code = JSON.stringify(d)
    let data = {secret: secret, code: crypto.AES.encrypt(code.trim(), secret.trim()).toString().replace(/\//g,'atala')}
    data['link'] = data.code
    return data['link'];
  }

  decrypt(textToDecrypt : string, secret:string){
    this.isConnecting = true
    let data = crypto.AES.decrypt(textToDecrypt.replace(/atala/g,'/'), secret.trim()).toString(crypto.enc.Utf8);

    if(!data) {
      return null
    }
    
    data = JSON.parse(data)
     this.isConnecting = false
    return data
   }

  makeSecret() {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return 'atala%'+this.user['id'];
 }
 

  startPaginator() {
    setTimeout(()=>{  
    this.dataSource.paginator = this.paginator;
    this.focusInput()
    },500);
  }

  focusInput() {
    if(!this.searchInput){return}
    this.searchInput.nativeElement.focus()
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
          
          if(res.body.mentor) {
            this.displayUserMentor(res.body.mentor);
          } else {
          this.getPendingMentors()
          }

         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }

  displayUserMentor(data: object) {
    this.hasMentor = true;
    let mentorArray = [];
    mentorArray.push(data);
    this.cleanData(mentorArray, 'all');
    this.learnUrl = data['profile']['e_learn']
    let pattern = /^(http|https):\/\//
    if (!this.learnUrl.match(pattern)) {
      this.learnUrl = 'https://' +this.learnUrl
    }
    this.learnUrl = Config.menteeLearn
  }

  getMenteeMentors() {
    this.isConnecting = true
    const subscription = this.userService.menteeMentors()
    this.subscription = subscription
    .subscribe(
        (res)=>{ 
        if(res.code==200) {
         this.cleanData(res.body, 'all')
        } else {
          this.hasError = true;
          this.isConnecting = false;
        }
      },
      (error)=>{
        this.hasError = true
        this.isConnecting = false
        let notification = errorMessage.ConnectionError(error)
        this.openSnackBar(notification, 'snack-error')
  
      });
  }

  getPendingMentors() {
    this.isConnecting = true
    const subscription = this.userService.pendingMentors()
    this.subscription = subscription
    .subscribe(
        (res)=>{ 
        if(res.code==200) {
          if(res.body) {
            this.cleanData(res.body, 'pending')
          } else {  
            this.getMenteeMentors()
          }
        } else {     
        }
      },
      (error)=>{
        this.hasError = true
        this.isConnecting = false
        let notification = errorMessage.ConnectionError(error)
        this.openSnackBar(notification, 'snack-error')
  
      });
  }

  cleanData(data: object[], type:string) {
    if(!data) {
      this.isConnecting = false;
      return
    }
    this.mentorList.splice(0, this.mentorList.length)
    data.forEach(x=> {
      let encrypted = this.encrypt(x)
      let data = {
        'name' :  {name:x['mentor']['full_name'], link: encrypted},
        'about' : x['profile']['about_me'],
        'data'  : encrypted
      }
      this.mentorList.push(data)
    });
    if(type=='pending') {
      this.pendingMentor = true
      this.hasMentor = false
    }
    this.isConnecting = false
  }

  logUserOut(message:string){
    this.clearToken()
    let notification = message
    this.openSnackBar(notification, 'snack-error')
    this.router.navigateByUrl('/login')
  }

  pageNotFound(){
    this.clearToken()
    this.router.navigateByUrl('/not-found')
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

  startCustomRouter(){
    this.route.params.subscribe(params=>{
          this.consumeRouteParams(params)
      });
  }

  consumeRouteParams(params: object) {
    this.startPaginator()
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

  newTab(link:string) {
    window.open(
      link,
      '_blank' // <- This is what makes it open in a new window or tab.
    );
  }


ngOnDestroy() {
  if(!this.subscription){return}
  this.subscription.unsubscribe();
}

}
