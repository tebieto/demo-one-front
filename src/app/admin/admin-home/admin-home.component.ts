import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location} from '@angular/common';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { UserService } from 'src/app/shared/user/user.service';
import { MatSnackBar, MatTableDataSource, MatPaginator } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Subscription } from 'rxjs';

export interface PeriodicElement {
  email: string;
  status: string;
  id: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { email: 'Hydrogen', status: "pending", id: 1},
  { email: 'Helium', status: "pending", id: 2},
  { email: 'Lithium', status: "pending", id: 3},
  { email: 'Beryllium', status: "pending", id: 4},
  { email: 'Boron', status: "pending", id: 5},
  { email: 'Carbon', status: "pending", id: 6},
  { email: 'Nitrogen', status: "pending", id: 7},
  { email: 'Oxygen', status: "pending", id: 8},
  { email: 'Fluorine', status: "pending", id: 9},
  { email: 'Neon', status: "pending", id: 10},
];


@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('csvUpload') csvUpload: ElementRef;
  displayedColumns: string[] = ['email', 'status', 'id'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  

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
  keyRole = 99;
  optionalRole = 88

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _location: Location,
    ) {}

  ngOnInit() {
    this.startPaginator()
    this.validateUser()
    this.startCustomRouter()
  }

  startPaginator() {
    this.isConnecting = true
    setTimeout(()=>{  
    this.dataSource.paginator = this.paginator;
    this.focusInput()
    this.isConnecting = false;
    },1000);
  }

  focusInput() {
    if(!this.searchInput){return}
    this.searchInput.nativeElement.focus()
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
    this.router.navigateByUrl('/admin')
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
      duration: 2000
    })
  }

  startCustomRouter(){
    this.route.params.subscribe(params=>{
          this.consumeRouteParams(params)
      });
  }

  consumeRouteParams(params: object) {
    this.startPaginator()
    if(!params['sub'] && !params['page']){return}
    
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
    }  else {
      this.pageNotFound()
    }

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
  this.goBack()
}

goBack(){
  this._location.back()
}

ngOnDestroy() {
  if(!this.subscription) {return}
  this.subscription.unsubscribe();
}


}
