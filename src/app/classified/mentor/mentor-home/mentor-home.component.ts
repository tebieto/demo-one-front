import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
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
  selector: 'app-mentor-home',
  templateUrl: './mentor-home.component.html',
  styleUrls: ['./mentor-home.component.css']
})
export class MentorHomeComponent implements OnInit {

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild('searchInput') searchInput: ElementRef;
  menteeList: PeriodicElement[] = [];
  pendingMenteeList: PeriodicElement[] = [];
  certificates: CertificateElement[] = [];
  displayedColumns: string[] = ['name', 'about', 'data'];
  displayedPendingColumns: string[] = ['name', 'about', 'msg', 'data',];
  certificateColumns: string[] = ['name', 'mentee', 'data'];
  dataSource = new MatTableDataSource(this.menteeList);
  pendingDataSource = new MatTableDataSource(this.pendingMenteeList);
  certificateDataSource = new MatTableDataSource(this.certificates);

  applyFilter(filterValue: string, type: string) {
    if(type=='all') {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else if(type=='pending') {
      this.pendingDataSource.filter = filterValue.trim().toLowerCase();
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
  keyRole = 55;
  optionalRole = 66;

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

  acceptMentee(param: string) {
    let code = param
    let secret = this.makeSecret()
    let data = this.decrypt(code, secret)
    let message = 'Are you sure you want to accept '+ data['value']['full_name']+'  as your Mentee?'
    this.openDialog(data['value'], message, param, 'accept')
  }

  rejectMentee(param: string) {
    let code = param
    let secret = this.makeSecret()
    let data = this.decrypt(code, secret)
    let message = 'Are you sure you want to reject '+ data['value']['full_name']+'?'
    this.openDialog(data['value'], message, param, 'reject')
  }

  openDialog(data: object, message, param:string, type:string): void {
    const dialogRef = this.dialog.open(SharedDialogComponent, {
      width: '250px',
      data: {id:data['id'], message:message}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        return
      }
      if(type=='accept') {
        this.addMentee(result, param)
      } else if(type=='reject') {
        
      this.removeMentee(result, param)
      }
    });
  }

  addMentee(id: number, param:string) {
    this.persistingData = true
    this.userService.addMentee(id)
    .subscribe(
      (res)=>{
        this.persistingData=false
        if(res.code != 200) {
          this.hasError = true
          this.showErrorMessage(res)
        }
  
        if(res.code==200) {
          this.moveMentee(param, 'accepted')
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

  removeMentee(id: number, param:string) {
    this.persistingData = true
    this.userService.removeMentee(id)
    .subscribe(
      (res)=>{
        this.persistingData=false
        if(res.code != 200) {
          this.hasError = true
          this.showErrorMessage(res)
        }
  
        if(res.code==200) {
          
          this.moveMentee(param, 'rejected')
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

  moveMentee(param: string, type:string){
    let mentee =  this.pendingMenteeList.find(x=> {
      return x.data == param
    });

    let index = this.menteeList.indexOf(mentee)
    if(type=='accepted') {
      this.menteeList.push(mentee)
    }
    this.pendingMenteeList.splice(index, 1)
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
    this.isConnecting = false;
    setTimeout(()=>{  
      this.certificateDataSource.paginator = this.paginator.toArray()[0];
      this.pendingDataSource.paginator = this.paginator.toArray()[1];
      this.dataSource.paginator = this.paginator.toArray()[2];
      this.focusInput()
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
        this.isConnecting=false
        if(res.code != 200) {
          this.hasError = true
          let message ='Invalid Session, Login Again.'
          this.logUserOut(message);
        }
  
        if(res.code==200) {
          this.inspectRole(res.body.role, 'match')
          this.user = res.body.user
          this.profileCode = this.encrypt(this.user)
          this.getMyMentees()
          this.getMenteeCertificate()
          this.getPendingMentees()
          this.verifyMentorSetup()
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
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
         if(res.status==false){
           this.gotoMentorSetupPage()
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

  gotoMentorSetupPage(){
    this.router.navigateByUrl('/mentor/quick/setup')
  }

  getMyMentees() {
    this.isConnecting = true
    const subscription = this.userService.mentorMentees()
    this.subscription = subscription
    .subscribe(
        (res)=>{ 
        if(res.code==200) {
        if(res.body==null) {
          this.isConnecting = false;
          return
        }
         this.cleanData(res.body)
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

  getPendingMentees() {
    this.isConnecting = true
    const subscription = this.userService.pendingMentorMentees()
    this.subscription = subscription
    .subscribe(
        (res)=>{ 
        if(res.code==200) {
        if(res.body==null) {
          this.isConnecting = false;
          return
        }
         this.cleanPendingData(res.body)
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

  getMenteeCertificate() {
    this.isConnecting = true
    const subscription = this.userService.pendingCertificates()
    this.subscription = subscription
    .subscribe(
        (res)=>{
        if(res.code==200) {
          if(res.body) {
            this.filterBody(res.body)
          } else {  
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

  filterBody(body:object[]) {
    body.forEach(data=> {
      this.cleanCertificateData(data)
    })
  }

  cleanCertificateData(data: object) {
    if(!data) {
      this.isConnecting = false;
      return
    }
      let newData = {
        'name' :  data['name'],
        'mentee' :  data['mentee'],
        'data'  : {id:data['id'], link:data['url'], certificate:data['certificate']}
      }
    this.certificates.push(newData)
    this.startPaginator()
    this.isConnecting = false
  }

  approveCertificate(id: number) {
    this.persistingData = true
    this.userService.approveCertificate(id)
    .subscribe(
      (res)=>{
        this.persistingData=false
        if(res.code != 200) {
          this.hasError = true
          this.showErrorMessage(res)
        }
  
        if(res.code==200) {
          let notification = res.message
          this.openSnackBar(notification, 'snack-success')
          this.removeCertificate(id)
         }
  
    },
    (error)=>{
      this.hasError = true
      this.persistingData = false
      let notification = errorMessage.ConnectionError(error)
      this.openSnackBar(notification, 'snack-error')
    });

  }
  
  removeCertificate(id:number) {
    let cert = this.certificates.find(x=> {
      return x['data']['id'] == id
    });
    if(!cert) {return}

    let  index = this.certificates.indexOf(cert)

    this.certificates.splice(index, 1)
    this.startPaginator()
  }

  cleanData(data: object[]) {
    this.isConnecting = true
    this.menteeList.splice(0, this.menteeList.length)
    data.forEach(x=> {
      let encrypted = this.encrypt(x)
      let data = {
        'name' :  {name:x['full_name'], link: encrypted},
        'about' : x['email'],
        'data'  : encrypted,
        'message': ""
      }
      this.menteeList.push(data)
    });
    this.startPaginator()
  }

  cleanPendingData(data: object[]) {
    this.isConnecting= true
    this.pendingMenteeList.splice(0, this.pendingMenteeList.length)
    data.forEach(x=> {
      let encrypted = this.encrypt(x)
      let data = {
        'name' :  {name:x['full_name'], link: encrypted},
        'about' : x['email'],
        'message' : x['message'],
        'data'  : encrypted
      }
      this.pendingMenteeList.push(data)
    });
    this.isConnecting = false;
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
