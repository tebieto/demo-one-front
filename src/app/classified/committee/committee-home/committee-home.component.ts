import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatTableDataSource, MatPaginator } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/user/user.service';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';

export interface PeriodicElement {
  'title': string;
  'description': string;
  id: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {'title': 'Hydrogen', 'description': "pending", id: 1},
  {'title': 'Helium', 'description': "pending", id: 2},
  {'title': 'Lithium Lithium Lithium Lithium Lithium Lithium Lithium Lithium Lithium', 'description': "pending pending pending pending pending pending pending pending pending pending pending pending pending pending pending pending pending pending pending pending pending pending pending", id: 3},
  {'title': 'Beryllium', 'description': "pending", id: 4},
  {'title': 'Boron', 'description': "pending", id: 5},
  {'title': 'Carbon', 'description': "pending", id: 6},
  {'title': 'Nitrogen', 'description': "pending", id: 7},
  {'title': 'Oxygen', 'description': "pending", id: 8},
  {'title': 'Fluorine', 'description': "pending", id: 9},
  {'title': 'Neon', 'description': "pending", id: 10},
];

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

  isConnecting: boolean;
  onStartUpload: boolean;
  persistingData: boolean;
  subscription: Subscription;

  user: object;
  hasError: boolean;
  page="ideas"
  sub = "pending"
  title='Pending Idea'

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
    ) {}

  ngOnInit() {
    this.validateUser()
    this.startPaginator()
    this.startCustomRouter()
  }

  startPaginator() {
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
          this.user = res.body.user
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
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
    if(!params['sub'] && !params['page']){return}
    
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

  const subscription = this.userService.createMultiUser(data)
  this.subscription = subscription
  .subscribe(
      (res)=>{
        this.onStartUpload = false;
        console.log(res)
  
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
      console.log(res)
      this.persistingData = false;
      this.clearForm()
  },
  (error)=>{
    this.persistingData = false;
    let notification = errorMessage.ConnectionError(error)
    this.openSnackBar(notification, 'snack-error')

  });
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
