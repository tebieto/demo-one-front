import { Component, OnInit } from '@angular/core';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-shared-bottom-sheet',
  templateUrl: './shared-bottom-sheet.component.html',
  styleUrls: ['./shared-bottom-sheet.component.css']
})
export class SharedBottomSheetComponent{

  constructor(private _bottomSheetRef: MatBottomSheetRef<SharedBottomSheetComponent>) {}

  openLink(event: MouseEvent): string {
    return 'hello'
  }

}
