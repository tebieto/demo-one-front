import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { MatSnackBar, MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';
import { UserService } from 'src/app/shared/user/user.service';
import * as crypto from 'crypto-js';
import { SharedDialogComponent } from 'src/app/shared/shared-dialog/shared-dialog.component';
import {CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';

export interface PeriodicElement {
  'name': object;
  'about': string;
  'data': string;
}

@Component({
  selector: 'app-mentor-mentees',
  templateUrl: './mentor-mentees.component.html',
  styleUrls: ['./mentor-mentees.component.css']
})
export class MentorMenteesComponent implements OnInit {

  menteeList: PeriodicElement[] = [];
  user: object;
  isConnecting: boolean;
  hasError: boolean;
  params: object;
  mentorProfile: object;
  hasMentor: boolean;
  persistingData: boolean;
  overview = [];
  enlargeAvatar: boolean;
  dataSource = new MatTableDataSource(this.menteeList);
  @ViewChild('searchInput') searchInput: ElementRef;
  displayedColumns: string[] = ['name', 'about', 'data'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  title: string;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  constructor(
    private _location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private userService: UserService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.validateUser()
    this.startCustomRouter()
    this.startPaginator()
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
          if(res.body.mentor) {
            this.hasMentor = true
          }
          this.user = res.body.user
          this.getMentorProfile(this.params['code'])
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }


  chooseMentor(param: string) {
    let code = param
    let secret = this.makeSecret()
    let data = this.decrypt(code, secret)
    let message = 'Are you sure you want to make '+ data['value']['mentor']['full_name']+' your Mentor?'
    this.openDialog(data['value'], message, param)
  }

  openDialog(data: object, message, param:string): void {
    const dialogRef = this.dialog.open(SharedDialogComponent, {
      width: '250px',
      data: {id:data['mentor']['id'], message:message}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        return
      }
      this.addMentee(result, param)
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
          this.hasMentor = true
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

  getMentorProfile(param: string){
    let code = param
    let secret = this.makeSecret()
    let data = this.decrypt(code, secret)
    this.mentorProfile = data['value']
    this.getUserOverview(this.mentorProfile['mentor']['id'])
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
    if(!data.mentees) {
      data.mentees = []
    }
    
    this.overview =data
    this.title = data.user.full_name+"'s Mentees"
    this.isConnecting = false;
    this.cleanData(data.mentees)
  }

  cleanData(data: object[]) {
    if(!data) {
      this.isConnecting = false;
      return
    }
    this.menteeList.splice(0, this.menteeList.length)
    data.forEach(y=> {
      let x= {}
      x['mentee'] = y
      let encrypted = this.encrypt(x)
      let data = {
        'name' :  {name:x['mentee']['full_name'], link: encrypted},
        'about' : x['mentee']['about_me'],
        'data'  : encrypted
      }
      this.menteeList.push(data)
    });
    this.isConnecting = false
  }
  
  encrypt(value : object) : string{
    let secret = this.makeSecret()
    let d = {secret: secret, value: value}

    let code = JSON.stringify(d)
    let data = {secret: secret, code: crypto.AES.encrypt(code.trim(), secret.trim()).toString().replace(/\//g,'atala')}
    data['link'] = data.code
    return data['link'];
  }

  startCustomRouter(){
    this.route.params.subscribe(params=>{
          this.consumeRouteParams(params)
      });
  }

  consumeRouteParams(params: object) {
    this.params = params
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

  showErrorMessage(error: object){
    this.persistingData = false;
      let notification = errorMessage.ConnectionError(error)
      this.openSnackBar(notification, 'snack-error')
      return
  
  }

  newTab(link:string) {
    if(link.length==0){
      let notification = 'Invalid Url'
      this.openSnackBar(notification, 'snack-error')
      return
    }
    window.open(
      link,
      '_blank' // <- This is what makes it open in a new window or tab.
    );
  }

  goBack() {
    this._location.back()
  }

}
