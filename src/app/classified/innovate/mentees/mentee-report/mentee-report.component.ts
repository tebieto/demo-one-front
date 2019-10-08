import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/user/user.service';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import * as crypto from 'crypto-js';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Title } from '@angular/platform-browser';
import { Config } from 'src/app/config';
import { SharedDialogComponent } from 'src/app/shared/shared-dialog/shared-dialog.component';


export interface CertificateElement {
  'name': string;
  'mentee': string;
  'data': object;
}
export interface PeriodicElement {
  'name': object;
  'about': string;
  'data': string;
  'message': string;
}

@Component({
  selector: 'app-mentee-report',
  templateUrl: './mentee-report.component.html',
  styleUrls: ['./mentee-report.component.css']
})
export class MenteeReportComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchInput') searchInput: ElementRef;
  mentorList: PeriodicElement[] = [];
  certificates: CertificateElement[] = [];
  displayedColumns: string[] = ['name', 'about', 'data'];
  displayedPendingColumns: string[] = ['name', 'about', 'msg', 'data',];
  certificateColumns: string[] = ['name', 'mentee', 'data'];
  dataSource = new MatTableDataSource(this.mentorList);
  certificateDataSource = new MatTableDataSource(this.certificates);

  applyFilter(filterValue: string, type: string) {
    if(type=='all') {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else if(type=='pending') {
      //
    }
  }

  isConnecting: boolean;
  onStartUpload: boolean;
  persistingData: boolean;
  subscription: Subscription;
  hasMentor: boolean;
  profileCode: string
  learn = Config.mentorLearn;
  user: object;
  hasError: boolean;
  keyRole = 44;
  optionalRole = 44;
  overview = []
  params: object
  profile: object

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private titleService:Title,
    public dialog: MatDialog,
    ) {}

  ngOnInit() {
    this.titleService.setTitle('IDEAHUB| Mentor Home')
    this.validateUser()
    this.startCustomRouter()
  }

  startPaginator() {
    this.isConnecting = true
    setTimeout(()=>{  
    this.dataSource.paginator = this.paginator;
    this.focusInput()
    this.isConnecting = false
    },1000);

    setTimeout(()=>{  
      this.certificateDataSource.paginator = this.paginator;
      this.dataSource.paginator = this.paginator;
      this.focusInput()
      this.isConnecting = false
      },2000);
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
        if(res.code != 200) {
          this.hasError = true
          let message ='Invalid Session, Login Again.'
          this.logUserOut(message);
        }
  
        if(res.code==200) {
          this.inspectRole(res.body.role, 'match')
          this.user = res.body.user
          this.getprofile(this.params['code'])
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }

  getprofile(param: string){
    let code = param
    let secret = this.makeSecret()
    let data = this.decrypt(code, secret)
    this.profile = data['value']['mentee']
    this.getUserOverview(this.profile['id'])
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


  getUserOverview(id: number){
    this.isConnecting= true
    this.userService.userOverview(id)
    .subscribe(
      (res)=>{
        if(res.code != 200) {
          this.hasError = true
          let message ='Invalid Session, Login Again.'
          this.logUserOut(message);
        }
  
        if(res.code==200) {
          this.manipulateOverview(res.body)
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }

  manipulateOverview(data: any) {
    data['approved'] = []
    data['certificates'] = []
    data['mentorCount'] = 0
    if(data['mentors'] && data.mentors.id>0) {
      data['mentorCount'] = 1
    } else {
      data['mentorCount'] = 0
      data['mentors']= []
    }
    if(data.ideas) {
    data.ideas.forEach(idea => {
      if(idea['committee_status']=='approved') {
        data['approved'].push(idea)
      }
    });
  } else {
    data['approved'] = []
  }

  if(data.program_certificates) {

    data.program_certificates.forEach(cert => {
      if(cert['status']=='approved') {
        data['certificates'].push(cert)
      }
    });
  } else {
    data['certificates'] = []
  }
    
    this.overview =data
    this.certificates = this.overview['certificates']
    this.mentorList = this.overview['mentors']
    this.startPaginator()
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
    this.params = params
    return
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
