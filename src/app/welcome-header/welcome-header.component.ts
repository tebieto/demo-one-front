import { Component, OnInit } from '@angular/core';
import { Config as config} from '../config';

@Component({
  selector: 'app-welcome-header',
  templateUrl: './welcome-header.component.html',
  styleUrls: ['./welcome-header.component.css']
})
export class WelcomeHeaderComponent implements OnInit {

  isPublic = config.isPublic;

  constructor() { }

  ngOnInit() {
  }

}
