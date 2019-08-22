import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from '../shared/user/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  providers: [UserService]
})
export class WelcomeComponent implements OnInit {

  partnerLogo = [
    {url: '/assets/images/partners/1.png'},
    {url: '/assets/images/partners/2.png'},
    {url: '/assets/images/partners/5.png'},
    {url: '/assets/images/partners/6.png'},
    {url: '/assets/images/partners/7.png'},
    {url: '/assets/images/partners/8.png'},
  ]



  constructor(
    private titleService: Title,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.titleService.setTitle('Welcome to SMEHUB')

    //this.fetchUserLocation();
  }

  fetchUserLocation(){
    this.userService.getLocation()
    .subscribe(
      (data)=> {
        
      }
    );
  }

}
