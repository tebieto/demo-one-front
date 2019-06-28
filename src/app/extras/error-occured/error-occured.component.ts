import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-occured',
  templateUrl: './error-occured.component.html',
  styleUrls: ['./error-occured.component.css']
})
export class ErrorOccuredComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  refreshPage(){
    location.reload()
  }

}
