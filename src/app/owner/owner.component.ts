import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user/user.service';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {
  hasRegistered: boolean;
  hasError: boolean;
  isConnecting: boolean;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.findAppOwner()
  }

  findAppOwner(){
    this.isConnecting = true
    this.userService.appOwner()
    .subscribe(
      (res)=>{
        this.isConnecting = false
        if(res.code==200){
            if(res.user){
              this.hasRegistered = true
              return
            } else {
              this.hasRegistered = false;
              return
            }
        } else {
          this.hasError = true
          return
        }
      },
      (error)=> {
        this.isConnecting = false;
        
        this.hasError=true
      }
    )
  }


}
