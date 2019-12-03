import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  show = false;
  externalUrl = '/welcome';
  constructor() { }
  ngOnInit() {

    window.open(this.externalUrl, '_self');
  }

}
