import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css']
})
export class OwnerComponent implements OnInit {

  hasRegistered: boolean;

  constructor() { }

  ngOnInit() {
    this.hasRegistered = true;
  }

}
