import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import {MatIconModule, MatToolbarModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule, MatSnackBarModule, MatProgressSpinnerModule, MatDivider, MatDividerModule, MatTableModule, MatMenuModule, MatStepperModule, MatSlideToggleModule, MatPaginatorModule, MatOptionModule, MatSelectModule, MatDialogModule, MatChipsModule, MatBottomSheetModule, MatListModule} from '@angular/material';
import { SnackbarComponent } from '../extras/snackbar/snackbar.component';
import { DialogComponent } from '../extras/dialog/dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorOccuredComponent } from '../extras/error-occured/error-occured.component';
import { PageLoadingComponent } from '../extras/page-loading/page-loading.component';
import { RouterModule } from '@angular/router';
import { SharedDialogComponent } from './shared-dialog/shared-dialog.component';
import { SharedAvatarComponent } from './shared-avatar/shared-avatar.component';
import { SharedMessageDialogComponent } from './shared-message-dialog/shared-message-dialog.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SnackbarComponent,
    DialogComponent,
    ErrorOccuredComponent,
    PageLoadingComponent,
    SharedDialogComponent,
    SharedAvatarComponent,
    SharedMessageDialogComponent
  ],

  entryComponents: [
    SnackbarComponent, DialogComponent, SharedDialogComponent, SharedMessageDialogComponent
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
    MatDialogModule,
    MatBottomSheetModule,
    MatChipsModule,
    MatListModule
  ],
  exports:[
    HeaderComponent,
    SnackbarComponent,
    DialogComponent,
    SharedDialogComponent,
    SharedMessageDialogComponent,
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
    SharedAvatarComponent,
    MatChipsModule,
    MatBottomSheetModule,
    MatListModule
  ],
})
export class SharedModule { }
