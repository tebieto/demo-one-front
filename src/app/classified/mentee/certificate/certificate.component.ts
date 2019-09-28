import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user/user.service';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {

  
  @ViewChild('fileUpload') fileUpload: ElementRef;

  persistingData: boolean;
  isConnecting: boolean
  user: object;
  hasError: boolean;
  firstFormGroup: FormGroup;
  programmeDurations = []
  keyRole = 44;
  optionalRole = 44;
  numberArray= []
  isUploadingFile: boolean;
  subscription: Subscription;
  newCertificate = '';

  constructor(
    private titleService:Title, 
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private _location: Location
    ) {

   }

  ngOnInit() {
    this.titleService.setTitle('IDEAHUB|Admin')
    this.prepareFormInputValidation()
    this.numberArray = this.fillNumberArray(100)
  }

  onFileUpload() {
    if(this.isUploadingFile){return}
    let el: HTMLElement = this.fileUpload.nativeElement;
    el.click();
}

onChooseFile(e) {
  var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
  var pattern = /.pdf/;
  const formData: FormData = new FormData();
  if (!file.name.match(pattern)) {
    alert('invalid format');
    return;
  }
  formData.append('file', file, file.name)
  this.persistFileData(formData);
  e.srcElement.value = '';
}

persistFileData(data) {
  this.isUploadingFile = true
  const subscription = this.userService.uploadFile(data)
  this.subscription = subscription
  .subscribe(
      (res)=>{
        this.isUploadingFile = false;
        this.newCertificate = res.body;
    },
    (error)=>{
      this.isUploadingFile = false;
      let notification = errorMessage.ConnectionError(error)
      this.openSnackBar(notification, 'snack-error')

    });
}

  fillNumberArray(number: number) {
    let newArray = []
    for (let index = 1; index <= number; index++) {
      newArray.push(index)
    }
    return newArray
  }

  getNameErrorMessage() {
    return this.firstFormGroup.controls['name'].errors.required ? 'Name on Certificate is required' :
    '';
  }

  getLinkErrorMessage() {
    return this.firstFormGroup.controls['link'].errors.required ? 'Link is required' :
    '';
  }


  prepareFormInputValidation(){
    this.firstFormGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      link: ['', [Validators.required]],
    });
   }
  
   clearFormField(field: string){

    if(field=='name') {
      this.firstFormGroup.get('name').setValue("");
    }

    if(field=='link') {
      this.firstFormGroup.get('link').setValue("");
    }

   }

   logUserOut(message:string){
    this.clearToken()
    let notification = message
    this.openSnackBar(notification, 'snack-error')
    this.router.navigateByUrl('/login')
  }

  clearToken() {
    localStorage.removeItem('token')
  }

  openSnackBar(message, panelClass) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: message,
      panelClass: [panelClass],
      duration: 10000
    })
  }

  newTab(link:string) {
    window.open(
      link,
      '_blank' // <- This is what makes it open in a new window or tab.
    );
  }

  goBack() {
    this._location.back()
  }

  ngOnDestroy() {
    if(!this.subscription) {return}
    this.subscription.unsubscribe();
  }
}
