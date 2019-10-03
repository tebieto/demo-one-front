import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-shared-score',
  templateUrl: './shared-score.component.html',
  styleUrls: ['./shared-score.component.css']
})
export class SharedScoreComponent {

  result = {msg: '', score: ''}
  numberArray = this.fillNumberArray(100)

  fillNumberArray(number: number) {
    let newArray = []
    for (let index = 1; index <= number; index++) {
      newArray.push(index)
    }
    return newArray
  }

  constructor(
    public dialogRef: MatDialogRef<SharedScoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
    
    ) {}

    onDontSave(): void {
      this.dialogRef.close();
    }

}

export interface DialogData {
  id: number;
  name: string;
  message: string;
  msg: string;
  scoreMessage:string
}