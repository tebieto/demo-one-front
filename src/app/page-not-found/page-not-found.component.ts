import { Component, OnInit } from '@angular/core';
import { Config } from '../config';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  currentYear = Config.currentYear
  appName = Config.appName


  constructor() { }

  ngOnInit() {

  }

}
