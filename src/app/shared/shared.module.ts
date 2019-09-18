import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import {MatIconModule, MatToolbarModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule, MatSnackBarModule, MatProgressSpinnerModule, MatDivider, MatDividerModule, MatTableModule, MatMenuModule, MatStepperModule, MatSlideToggleModule, MatPaginatorModule, MatOptionModule, MatSelectModule, MatDialogModule} from '@angular/material';
import { SnackbarComponent } from '../extras/snackbar/snackbar.component';
import { DialogComponent } from '../extras/dialog/dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorOccuredComponent } from '../extras/error-occured/error-occured.component';
import { PageLoadingComponent } from '../extras/page-loading/page-loading.component';
import { RouterModule } from '@angular/router';
import { SharedDialogComponent } from './shared-dialog/shared-dialog.component';
import { SharedAvatarComponent } from './shared-avatar/shared-avatar.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SnackbarComponent,
    DialogComponent,
    ErrorOccuredComponent,
    PageLoadingComponent,
    SharedDialogComponent,
    SharedAvatarComponent
  ],

  entryComponents: [
    SnackbarComponent, DialogComponent, SharedDialogComponent
  ],
  
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTableModule,
    MatMenuModule,
    MatStepperModule,
    MatSlideToggleModule,
    RouterModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  exports:[
    HeaderComponent,
    SnackbarComponent,
    DialogComponent,
    SharedDialogComponent,
    ErrorOccuredComponent,
    PageLoadingComponent,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTableModule,
    MatMenuModule,
    MatStepperModule,
    MatSlideToggleModule,
    RouterModule,
    MatPaginatorModule,
    MatOptionModule,
    MatSelectModule,
    MatDialogModule,
    SharedAvatarComponent
  ],
})
export class SharedModule { }
