import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [UserService]
})
export class AdminComponent implements OnInit {

  public hasRegistered: boolean;
  hasError: boolean;
  isConnecting: boolean;
  

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.findSuperAdmin();
  }

  findSuperAdmin() {
    this.isConnecting = true
    this.userService.superAdmin()
    .subscribe((res) => {
        this.isConnecting = false
        if (res.code === 200){
            if (res.user) {
              this.hasRegistered = true;
            } else {
              this.hasRegistered = false;
            }
        } else {
          this.hasError = true;
        }
      }, (error) => {
        this.isConnecting = false;
        this.hasError = true;
      }
    )
  }

}
