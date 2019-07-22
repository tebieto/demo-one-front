import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import {MatIconModule, MatToolbarModule, MatButtonModule, MatCardModule, MatInputModule, MatFormFieldModule, MatSnackBarModule, MatProgressSpinnerModule, MatDivider, MatDividerModule, MatTableModule, MatMenuModule} from '@angular/material';
import { SnackbarComponent } from '../extras/snackbar/snackbar.component';
import { DialogComponent } from '../extras/dialog/dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorOccuredComponent } from '../extras/error-occured/error-occured.component';
import { PageLoadingComponent } from '../extras/page-loading/page-loading.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SnackbarComponent,
    DialogComponent,
    ErrorOccuredComponent,
    PageLoadingComponent
  ],
  entryComponents: [
    SnackbarComponent, DialogComponent,
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
    MatMenuModule
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
    MatMenuModule
  ],
})
export class SharedModule { }
