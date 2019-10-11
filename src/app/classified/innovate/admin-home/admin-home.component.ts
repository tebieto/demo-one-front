import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location} from '@angular/common';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { UserService } from 'src/app/shared/user/user.service';
import { MatSnackBar, MatTableDataSource, MatPaginator, ErrorStateMatcher } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Subscription } from 'rxjs';

export interface PeriodicElement {
  email: string;
  status: string;
  role: string
  data: object;
}


let isAllowed = false;

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective| NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted) && isAllowed);
  }
}

const ELEMENT_DATA: PeriodicElement[] = [];


@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('csvUpload') csvUpload: ElementRef;
  displayedColumns: string[] = ['email', 'role', 'status', 'action'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  matcher = new MyErrorStateMatcher();

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isConnecting: boolean;
  onStartUpload: boolean;
  persistingData: boolean;
  subscription: Subscription;

  user: object;
  hasError: boolean;
  page="settings"
  sub = "admin"
  title='Administrator'
  keyRole = 44;
  optionalRole = 44
  allInvites = []

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    ) {}

  ngOnInit() {
    this.startCustomRouter()
  }

  fetchInvitedUsers() {
    this.isConnecting = true
    const subscription = this.userService.allInvitedUsers()
    this.subscription = subscription
    .subscribe(
        (res)=>{
        if(res.code==200) {
          this.manipulateUsers(res.body)
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

  manipulateUsers(data: object[]) {
    this.isConnecting = true;
    this.allInvites = []
    if (!data) { 
      this.isConnecting = false;
      return
    }
    if(data.length==0) {
      this.isConnecting = false;
      return
    }

    data.forEach(invite=> {
  
      if(this.sub=='admin' && invite['role']==88 || invite['role']==99) {
          if(invite['role']==99) {
            invite['role_name'] = 'Super Admin'
          } else if(invite['role']==88) {
            invite['role_name'] = 'Administrator'
          }
          this.allInvites.push(invite)
      } else if (this.sub=='committee' && invite['role']==77) {
          invite['role_name'] = 'Committee'
          this.allInvites.push(invite)
      } else if (this.sub=='mentor' && invite['role']==66) {
          invite['role_name'] = 'Mentor'
          this.allInvites.push(invite)
      } else if (this.sub=='mentee' && invite['role']==55) {
          invite['role_name'] = 'Mentee'
          this.allInvites.push(invite)
      } else if (this.sub=='innovate' && invite['role']==44) {
        invite['role_name'] = 'Innovate Administrator'
        this.allInvites.push(invite)
    }
  
      });
  
    this.pushInvite(this.allInvites)

  }

  pushInvite(data: object[]) {
    ELEMENT_DATA.splice(0, ELEMENT_DATA.length)
    data.forEach(invite=> {
      let element = {data:{}, status:'', email: '', role: ''}
      element['email']= invite['email']
      element['status']= invite['status']
      element['data'] = {status:invite['status'],data:{full_name:invite['full_name'], email: invite['email'], role: invite['role']}}
      element['role'] = invite['role_name']
      ELEMENT_DATA.push(element)
    });

    this.startPaginator()
  }



  startPaginator() {
    this.isConnecting = false
    setTimeout(()=>{  
    this.dataSource.paginator = this.paginator;
    this.focusInput()
    },200);
  }

  focusInput() {
    if(!this.searchInput){return}
    this.searchInput.nativeElement.focus()
  }

  validateUser(){
    let token = localStorage.getItem('token')
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
          this.fetchInvitedUsers()
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
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
      duration: 6000
    })
  }

  startCustomRouter(){
    this.route.params.subscribe(params=>{
          isAllowed = true
          this.consumeRouteParams(params)
      });
  }

  consumeRouteParams(params: object) {
    if(!params['sub'] && !params['page']){
      this.validateUser()
      return
    }
    if(params['page']=='settings' && params['sub']=='admin') {
      this.page = params['page']
      this.sub = params['sub']
      this.title = 'Administrator'
    } else if(params['page']=='new' && params['sub']=='admin') {
      this.page = params['page']
      this.sub = params['sub']
      this.title = 'Administrator'
    } else if(params['page']=='settings' && params['sub']=='committee') {
      this.page = params['page']
      this.sub = params['sub']
      this.title = 'Committee Member'
    } else if(params['page']=='new' && params['sub']=='committee') {
      this.page = params['page']
      this.sub = params['sub']
      this.title = 'Committee Member'
    } else if(params['page']=='settings' && params['sub']=='mentor') {
      this.page = params['page']
      this.sub = params['sub']
      this.title = 'Mentor'
    } else if(params['page']=='new' && params['sub']=='mentor') {
      this.page = params['page']
      this.sub = params['sub']
      this.title = 'Mentor'
    } else if(params['page']=='settings' && params['sub']=='mentee') {
      this.page = params['page']
      this.sub = params['sub']
      this.title = 'Mentee'
    } else if(params['page']=='new' && params['sub']=='mentee') {
      this.page = params['page']
      this.sub = params['sub']
      this.title = 'Mentee'
    } else if(params['page']=='settings' && params['sub']=='innovate') {
      this.page = params['page']
      this.sub = params['sub']
      this.title = 'Innovate Administrator'
    }else if(params['page']=='new' && params['sub']=='innovate') {
      this.page = params['page']
      this.sub = params['sub']
      this.title = 'Innovate Administrator'
    } else {
      this.pageNotFound()
    }
    
    this.validateUser()

  }


  email = new FormControl('', [Validators.required, Validators.email]);
  name = new FormControl('', [Validators.required]);

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

onCSVUpload() {
    if(this.onStartUpload){return}
    let el: HTMLElement = this.csvUpload.nativeElement;
    el.click();
}

onChooseCSV(e) {
  var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
  var pattern = /.csv/;
  const formData: FormData = new FormData();
  if (!file.name.match(pattern)) {
    alert('invalid format');
    return;
  }
  formData.append('file', file, file.name)
  this.persistCSVData(formData);
  e.srcElement.value = '';
}

persistCSVData(data) {
  this.onStartUpload = true
  let role = this.getActiveRole()

  if(role==0) {
    alert('An Error Occoured')
    return
  }

  data.append('role', role)

  const subscription = this.userService.createMultiUser(data)
  this.subscription = subscription
  .subscribe(
      (res)=>{
        this.onStartUpload = false;
        this.isForbidden(res)
        this.openSnackBar(res.body, 'snack-success')
    },
    (error)=>{
      this.onStartUpload = false;
      let notification = errorMessage.ConnectionError(error)
      this.openSnackBar(notification, 'snack-error')

    });
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
  } else if(this.sub=='innovate') {
    return 44
  } else {
    return 0
  }
}

onSubmit(){
  isAllowed = true;
  if(this.persistingData){return}

  if(this.name.invalid || this.email.invalid){
    let notification = "You have errors in your form"
    this.openSnackBar(notification, 'snack-error')
    return
  }
  
  let role = this.getActiveRole()

  let data ={
    "email": this.email.value.trim(),
    "full_name": this.name.value.trim(),
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
      this.isForbidden(res)
      this.persistingData = false;
      this.clearForm()
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

showErrorMessage(error: object){
  this.persistingData = false;
    let notification = errorMessage.ConnectionError(error)
    this.openSnackBar(notification, 'snack-error')
    return

}

clearForm() {
  isAllowed = false
  this.name.setValue('');
  this.email.setValue('');
}

goBack(){
  this._location.back()
}

ngOnDestroy() {
  if(!this.subscription) {return}
  this.subscription.unsubscribe();
}


}
