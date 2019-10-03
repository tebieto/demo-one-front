import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/user/user.service';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { Asset as crypto} from 'src/app/asset';
import { SharedDialogComponent } from 'src/app/shared/shared-dialog/shared-dialog.component';
import { SharedScoreComponent } from 'src/app/shared/shared-score/shared-score.component';

export interface PeriodicElement {
  'title': string;
  'description': string;
  'id': number;
  'link': string;
  'status': string;
  'idea': object;
}

const ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-committee-home',
  templateUrl: './committee-home.component.html',
  styleUrls: ['./committee-home.component.css']
})
export class CommitteeHomeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('csvUpload') csvUpload: ElementRef;
  displayedColumns: string[] = ['title', 'description', 'id'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  allIdeas= [];
  isConnecting: boolean;
  onStartUpload: boolean;
  persistingData: boolean;
  subscription: Subscription;

  user: object;
  hasError: boolean;
  page="ideas"
  sub = "pending"
  title='Pending Idea'
  keyRole = 77
  optionalRole = 77

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
    ) {}

  ngOnInit() {
    this.startPaginator()
    this.startCustomRouter()
  }

  startPaginator() {
    setTimeout(()=>{  
    this.dataSource.paginator = this.paginator;
    this.focusInput()
    this.isConnecting = false
    },200);
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
          let message ='Invalid Session, Login Again.'
          this.logUserOut(message);
        }
  
        if(res.code==200) {
          this.inspectRole(res.body.role, 'match');
          this.user = res.body.user;
          this.fetchIdeas()
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }

  fetchIdeas() {
    const subscription = this.userService.allUserIdeas()
    this.subscription = subscription
    .subscribe(
        (res)=>{
        if(res.code==200) {
          this.manipulateIdea(res.body)
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

  manipulateIdea(data: object[]) {
  this.isConnecting = true;
  this.allIdeas = []
  if (!data) {
    this.isConnecting=false
     return
    }
  if(data.length==0) {
    this.isConnecting=false
    return
  }

  if(this.sub=='all') {
    this.allIdeas = data
    this.pushIdea(this.allIdeas)
    return
  }

  data.forEach(idea=> {

    if(this.sub=='pending' && idea['committee_status']=='pending') {
        this.allIdeas.push(idea)
    } else if (this.sub=='approved' && idea['committee_status']=='approved') {
        this.allIdeas.push(idea)
    }

    });

  this.pushIdea(this.allIdeas)

  }


  pushIdea(data: object[]) {
    ELEMENT_DATA.splice(0, ELEMENT_DATA.length)
    data.forEach(idea=> {
      let encrypted = crypto.encrypt(idea, this.user['id'])
      let element = {id:0, description:'', title: '', link: '', status: '', idea:{}}
      element['id']= idea['id']
      element['link'] = encrypted
      element['description']= idea['description']
      element['title'] = idea['title']
      element['status'] = idea['status']
      element['idea'] = idea
      ELEMENT_DATA.push(element)
    });

    this.startPaginator()
  }


  onApproveMessage(idea: object) {
    let data = idea
    let message = 'Sure you want to approve Idea with title: "' + idea['title']+ '"?';
    let msg = 'Briefly tell us why you want to approve this Idea';
    this.openSheet(data, message, msg, 'approve')
  }

  onRejectMessage(idea: object) {
    let data = idea
    let message = 'Sure you want to reject Idea with title: "' + idea['title']+ '"?';
    let msg = 'Briefly tell us why you want to reject this Idea';
    this.openSheet(data, message, msg, 'reject')
  }



  openSheet(data: object, message, msg:string, type: string): void {
    let scoreMessage = "Grade this Idea over 100"
    const dialogRef = this.dialog.open(SharedScoreComponent, {
      width: '400px',
      data: {id:data['id'], message:msg, scoreMessage: scoreMessage}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        return
      }
      if(type=='approve') {
        this.onApprove(data, result)
      } else if(type=='reject') {
        this.onReject(data, result)
      }
    });
  }


  onApprove(idea: object, sheetData: object) :void{
    let message = 'Sure you want to approve Idea with title: "' + idea['title']+ '"?'
    this.openDialog(idea, message, sheetData, 'approve')
  }

  onReject(idea: object, sheetData: object) :void{
    let message = 'Sure you want to reject Idea with title: "' + idea['title']+ '"?'
    this.openDialog(idea, message, sheetData, 'reject')
  }

  openDialog(data: object, message, sheetData, type: string): void {
    const dialogRef = this.dialog.open(SharedDialogComponent, {
      width: '250px',
      data: {id:data['id'], message:message}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        return
      }
      if(type=='approve') {   
        this.approveIdea(data['id'], sheetData)
      } else if(type=='reject') {
        this.rejectIdea(data['id'], sheetData)
      }
    });
  }

  approveIdea(id: number, sheetData: object) {
    let data = {id: id, committee_comment: sheetData['msg'], committee_score: sheetData['score'] }
    this.persistingData = true
    this.userService.committeeApproveIdea(data)
    .subscribe(
      (res)=>{
        this.persistingData=false
        if(res.code != 200) {
          this.hasError = true
          this.showErrorMessage(res)
        }
  
        if(res.code==200) {
          this.markIdea(id, 'approved')
          let notification = res.body
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

  rejectIdea(id: number, sheetData: object) {
    let data = {id: id, committee_comment: sheetData['msg'], committee_score: sheetData['score'] }
    this.persistingData = true
    this.userService.committeeRejectIdea(data)
    .subscribe(
      (res)=>{
        this.persistingData=false
        if(res.code != 200) {
          this.hasError = true
          this.showErrorMessage(res)
        }
  
        if(res.code==200) {
         this.markIdea(id, 'rejected')
          let notification = res.body;
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

  markIdea(id:number, type:string) {
   let idea = this.allIdeas.find(x=> {
      return x.id==id
    });

    if(!idea) {return}

    idea['committee_status'] = type;
  }


  logUserOut(message:string){
    this.clearToken();
    let notification = message;
    this.openSnackBar(notification, 'snack-error');
    this.router.navigateByUrl('/login');
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
    if(!params['sub'] && !params['page']){
      this.validateUser()
      return
    }
    
    if(params['page']=='ideas' && params['sub']=='all') {
      this.page = params['page']
      this.sub = params['sub']
      this.title = 'All Idea'
    } else if(params['page']=='ideas' && params['sub']=='pending') {
      this.page = params['page']
      this.sub = params['sub']
      this.title = 'Pending Idea'
    } else if(params['page']=='ideas' && params['sub']=='approved') {
      this.page = params['page']
      this.sub = params['sub']
      this.title = 'Approved Idea'
    }  else {
      this.pageNotFound()
    }
    
    this.validateUser()

  }


  email = new FormControl('', [Validators.required, Validators.email]);
  name = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(100) ]);

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'Email is required' :
        this.email.hasError('email') ? 'Invalid Email Address' :
            '';
  }

  getNameErrorMessage() {
    return this.name.hasError('required') ? 'Full Name is required' :
        this.name.hasError('minlength') ? 'Minimum length is 6' :
        this.name.hasError('maxlength') ? 'Maximum length is 100' :
            '';
  }


getActiveRole() :number{
  
  if(this.sub=='admin') {
    return 88
  } else if(this.sub=='committee') {
    return 77
  } else if(this.sub=='mentor') {
    return 66
  } else if(this.sub=='mentee') {
    return 55
  } else {
    return 0
  }
}

onSubmit(){

  if(this.persistingData){return}

  if(this.name.invalid || this.email.invalid){
    let notification = "You have errors in your form"
    this.openSnackBar(notification, 'snack-error')
    return
  }
  
  let role = this.getActiveRole()

  let data ={
    "email": this.email.value.trim(),
    "name": this.name.value.trim(),
    "role": role
  }
  
  this.persistData(data)

}

persistData(data: Object){
  this.persistingData = true;
  const subscription = this.userService.createSingleUser(data);
  this.subscription = subscription
  .subscribe(
    (res)=>{
      this.persistingData = false;
      this.clearForm()
  },
  (error)=>{
    this.persistingData = false;
    let notification = errorMessage.ConnectionError(error)
    this.openSnackBar(notification, 'snack-error')

  });
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

clearForm() {
  this.name.setValue('');
  this.email.setValue('');
}

ngOnDestroy() {
  if(!this.subscription){return}
  this.subscription.unsubscribe();
}
}
