import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-shared-message-dialog',
  templateUrl: './shared-message-dialog.component.html',
  styleUrls: ['./shared-message-dialog.component.css']
})
export class SharedMessageDialogComponent {

  msg: string;

  constructor(
    public dialogRef: MatDialogRef<SharedMessageDialogComponent>,
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
}