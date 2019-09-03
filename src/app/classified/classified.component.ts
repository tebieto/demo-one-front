import { Component, OnInit} from '@angular/core';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { UserService } from 'src/app/shared/user/user.service';
import { MatSnackBar} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-classified',
  templateUrl: './classified.component.html',
  styleUrls: ['./classified.component.css']
})
export class ClassifiedComponent implements OnInit {


  isConnecting: boolean;
  subscription: Subscription;

  user: object;
  hasError: boolean;
  keyRole = 55;
  optionalRole = 55;
  links = [];

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
    ) {}

  ngOnInit() {
    this.validateUser()
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
          this.inspectRole(res.body.role, 'unmatch')
          this.resolveLinks(res.body.role)
          
          
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }

  resolveLinks(role: any) {

    if(role[0]) {
      //It is an Array
      if(role.length==1) {
        // Avoid Looping a array of one object
        this.resolveLink(role[0].code, role[0].role)
      } else {
        // Loop Through the array
        role.forEach(r=> {
          this.resolveLink(r.code, r.role)
        });
      }

    } else if(role.code){
      //Its a single Object
      this.resolveLink(role.code, role.role)
    }
  }

  resolveLink(code: number, role:string) {
    let data = {}
    if(code==88 || code == 99) {
      data['url'] = '/admin/home'
      data['text'] = role
      this.pushToLink(data)
    } else if(code==77) {
      data['url'] = '/committee'
      data['text'] = role
      this.pushToLink(data)
    } else if(code== 66) {
      data['url'] = '/mentor/quick/setup'
      data['text'] = role
      this.pushToLink(data)
    } else {
      let message ='Invalid Session, Login Again.'
      this.logUserOut(message);
    }
  }

  pushToLink(data: object) {
    let isThere = this.links.find(l=>{
      return l.text == data['text']
    })

    if(!isThere) {
      this.links.push(data)
    }
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
      duration: 2000
    })
  }  


ngOnDestroy() {
  if(!this.subscription) {return}
  this.subscription.unsubscribe();
}


}
