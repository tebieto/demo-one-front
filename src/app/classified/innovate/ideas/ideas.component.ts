import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/user/user.service';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { Asset as crypto} from 'src/app/asset';

export interface PeriodicElement {
  'title': string;
  'description': string;
  'id': number;
  'link': string;
  'status': string;
  'idea': object;
  'score': string;
  'comment': string;
}


@Component({
  selector: 'app-ideas',
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.css']
})
export class IdeasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('csvUpload') csvUpload: ElementRef;
  ideas: PeriodicElement[] = [];
  displayedColumns: string[] = ['title', 'description','comment', 'score', 'id'];
  dataSource = new MatTableDataSource(this.ideas);
  

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
  title='Pending Idea'
  keyRole = 44
  optionalRole = 44
  overview = []
  cutOff = 50

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
        if(res.code != 200) {
          let message ='Invalid Session, Login Again.'
          this.logUserOut(message);
        }
  
        if(res.code==200) {
          this.inspectRole(res.body.role, 'match');
          this.user = res.body.user;
          this.fetchCustomData()
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
          if(!res.body || res.body.idea_cut_off==0 || res.body.maximum_mentee==0) {return}
          this.manipulateSettings(res.body)
        } else {
          this.hasError = true
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
    this.isConnecting = true;
    if(data['idea_cut_off']>=0) {
      this.cutOff = data['idea_cut_off']
    }
    this.fetchSystemOverview()
  }


  fetchSystemOverview() {
    this.isConnecting = true
    const subscription = this.userService.systemOverview()
    this.subscription = subscription
    .subscribe(
        (res)=>{
        if(res.code==200) {
          this.manipulateOverview(res.body)
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

  manipulateOverview(data: any) {
    this.overview['top'] = []
    this.overview['ideas'] = []
    data.mentees.forEach(mentee => {
      this.pushMenteeIdeas(mentee.ideas)
    });

    if(this.page=='approved') {
      this.pushIdea(this.overview['ideas'])
    } else if(this.page=='top') {
      this.pushIdea(this.overview['top'])
    }  
  }

  pushMenteeIdeas(idea: object[]) {
    idea.forEach(x=> {
      if(x['committee_status']=='approved') {
        this.overview['ideas'].push(x)
      }
      if(x['committee_score']>=this.cutOff) {
        this.overview['top'].push(x)
      }
    })
  }


  pushIdea(data: object[]) {
    this.ideas.splice(0, this.ideas.length)
    data.forEach(idea=> {
      let encrypted = crypto.encrypt(idea, this.user['id'])
      let element = {id:0, description:'', title: '', comment: '', score: '', link: '', status: '', idea:{}}
      element['id']= idea['id']
      element['score']= idea['committee_score']
      element['comment']= idea['committee_comment']
      element['link'] = encrypted
      element['description']= idea['description']
      element['title'] = idea['title']
      element['status'] = idea['status']
      element['idea'] = idea
      this.ideas.push(element)
    });

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
    if(!params['page']){
      this.validateUser()
      return
    }
    
    if(params['page']=='top') {
      this.page = params['page'];
      this.title = 'Top Idea';
    } else if(params['page']=='approved') {
      this.page = params['page']
      this.title = 'Approved Idea'
    } else {
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
