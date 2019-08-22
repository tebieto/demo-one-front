import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatTableDataSource, MatPaginator } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
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
  selector: 'app-mentor-home',
  templateUrl: './mentor-home.component.html',
  styleUrls: ['./mentor-home.component.css']
})
export class MentorHomeComponent implements OnInit {

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
    //this.validateUser()
    this.startPaginator()
    this.startCustomRouter()
  }

  startPaginator() {
    this.isConnecting = true
    setTimeout(()=>{  
    this.dataSource.paginator = this.paginator;
    this.focusInput()
    this.isConnecting = false;
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


ngOnDestroy() {
  if(!this.subscription){return}
  this.subscription.unsubscribe();
}

}
