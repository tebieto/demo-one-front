import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-shared-dialog',
  templateUrl: './shared-dialog.component.html',
  styleUrls: ['./shared-dialog.component.css']
})
export class SharedDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SharedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onDontSave(): void {
      this.dialogRef.close();
    }

}

export interface DialogData {
  id: number;
  name: string
}