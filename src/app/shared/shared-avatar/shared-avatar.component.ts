import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../authentication/login.service';
import { UserService } from '../user/user.service';
import { Subscription } from 'rxjs';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SharedDialogComponent } from '../shared-dialog/shared-dialog.component';

@Component({
  selector: 'app-shared-avatar',
  templateUrl: './shared-avatar.component.html',
  styleUrls: ['./shared-avatar.component.css']
})
export class SharedAvatarComponent implements OnChanges {

  @Input() user: object;
  @ViewChild('avatarUpload') avatarUpload: ElementRef;
  authUser: any
  isUploadingAvatar: boolean;
  subscription: Subscription;
  newAvatar: any;
  previousAvatar: any;

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnChanges() {
    this.authUser = this.user
    this.authUser['avatar'] = this.authUser['image']
  }

  onChooseAvatar(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    const formData: FormData = new FormData();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    formData.append('image', file, file.name)
    this.persistAvatarData(formData);
    e.srcElement.value = '';
  }

  persistAvatarData(data) {
    this.isUploadingAvatar = true
    const subscription = this.userService.uploadImage(data)
    this.subscription = subscription
    .subscribe(
        (res)=>{
          this.isUploadingAvatar = false;
          this.newAvatar = res.body;
          this.manipulateAvatar()
      },
      (error)=>{
        this.isUploadingAvatar = false;
        let notification = errorMessage.ConnectionError(error)
        this.openSnackBar(notification, 'snack-error')
  
      });
  }

  manipulateAvatar() {
    let message = 'Save New Avatar'
    this.previousAvatar = this.authUser.avatar
    this.authUser.avatar = this.newAvatar
    this.openAvatarDialog(message, this.newAvatar)
  }

  onAvatarUpload() {
    let el: HTMLElement = this.avatarUpload.nativeElement;
    el.click();
  }

  openAvatarDialog(message:string, avatar: string): void {
    const dialogRef = this.dialog.open(SharedDialogComponent, {
      width: '250px',
      data: {id:1, message:message}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(!result){
        this.authUser.avatar = this.previousAvatar
        return
      }
      this.saveAvatar(avatar)
    });
  }

  saveAvatar(avatar: string) {
    let data ={
      "about": this.authUser.about,
      "email": this.authUser.email,
      "full_name": this.authUser.full_name,
      "username": this.authUser.username,
      "image": avatar,
    }
    
    this.persistAvatar(data)
  }


  persistAvatar(data: Object){
    this.userService.updateUser(data)
    .subscribe(
      (res)=>{
        if(res.code != 200) {
        }
  
        if(res.code==200) {
        }
  
    },
    (error)=>{
      let notification = errorMessage.ConnectionError(error)
      this.openSnackBar(notification, 'snack-error')
      return
  
    });
  }

  openSnackBar(message, panelClass) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: message,
      panelClass: [panelClass],
      duration: 2000
    })
  }

}
