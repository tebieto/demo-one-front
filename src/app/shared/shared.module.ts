import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import {MatIconModule, MatToolbarModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule, MatSnackBarModule, MatProgressSpinnerModule, MatDivider, MatDividerModule, MatTableModule, MatMenuModule, MatStepperModule, MatSlideToggleModule, MatPaginatorModule, MatOptionModule, MatSelectModule, MatDialogModule, MatChipsModule, MatBottomSheetModule, MatListModule, MatBadgeModule, MatCheckboxModule} from '@angular/material';
import { SnackbarComponent } from '../extras/snackbar/snackbar.component';
import { DialogComponent } from '../extras/dialog/dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorOccuredComponent } from '../extras/error-occured/error-occured.component';
import { PageLoadingComponent } from '../extras/page-loading/page-loading.component';
import { RouterModule } from '@angular/router';
import { SharedAvatarComponent } from './shared-avatar/shared-avatar.component';
import { SharedMessageDialogComponent } from './shared-message-dialog/shared-message-dialog.component';
import { SharedScoreComponent } from './shared-score/shared-score.component';
import { SharedDialogComponent } from './shared-dialog/shared-dialog.component';
import { SharedNotificationComponent } from './shared-notification/shared-notification.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SnackbarComponent,
    DialogComponent,
    ErrorOccuredComponent,
    PageLoadingComponent,
    SharedDialogComponent,
    SharedAvatarComponent,
    SharedMessageDialogComponent,
    SharedScoreComponent,
    SharedNotificationComponent,
  ],

  entryComponents: [
    SnackbarComponent, DialogComponent, SharedDialogComponent, SharedMessageDialogComponent, SharedScoreComponent, SharedNotificationComponent
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
    MatListModule,
    MatOptionModule,
    MatSelectModule,
    MatBadgeModule,
    MatCheckboxModule
  ],
  exports:[
    HeaderComponent,
    SnackbarComponent,
    DialogComponent,
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
    MatListModule,
    MatOptionModule,
    MatSelectModule,
    SharedScoreComponent,
    SharedDialogComponent,
    SharedMessageDialogComponent,
    MatBadgeModule,
    MatCheckboxModule,
    SharedNotificationComponent
  ],
})
export class SharedModule { }
