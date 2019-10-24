import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/user/user.service';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import * as crypto from 'crypto-js';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Title } from '@angular/platform-browser';

export interface PeriodicElement {
  'name': object;
  'about': string;
  'data': string;
}


@Component({
  selector: 'app-mentors',
  templateUrl: './mentors.component.html',
  styleUrls: ['./mentors.component.css']
})
export class MentorsComponent implements OnInit {

  mentorList: PeriodicElement[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchInput') searchInput: ElementRef;
  displayedColumns: string[] = ['name', 'about', 'data'];
  dataSource = new MatTableDataSource(this.mentorList);
  learnUrl: string;

  applyFilter(filterValue: string) {
    this.titleService.setTitle('IDEAHUB| Mentor Profile')
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isConnecting: boolean;
  onStartUpload: boolean;
  persistingData: boolean;
  subscription: Subscription;
  hasMentor: boolean;
  
  page="mentors"
  title='All Mentors'
  user: object;
  hasError: boolean;
  keyRole = 88;
  optionalRole = 99;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private titleService:Title,
    public dialog: MatDialog,
    ) {}

  ngOnInit() {
    this.titleService.setTitle('IDEAHUB|Mentee Home')
    this.validateUser()
    this.startPaginator()
    this.startCustomRouter()
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
                
          this.getMentors()
          

         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }


  getMentors() {
    this.isConnecting = true
    const subscription = this.userService.systemOverview()
    this.subscription = subscription
    .subscribe(
        (res)=>{ 
        if(res.code==200) {
         this.cleanData(res.body.mentors)
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

  cleanData(data: object[]) {
    if(!data) {
      this.isConnecting = false;
      return
    }
    this.mentorList.splice(0, this.mentorList.length)
    data.forEach(x=> {
      x['profile'] = x['mentor_program']
      let encrypted = this.encrypt(x)
      let data = {
        'name' :  {name:x['mentor']['full_name'], link: encrypted},
        'about' : x['profile']['about_me'],
        'data'  : encrypted
      }
      this.mentorList.push(data)
    });
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
