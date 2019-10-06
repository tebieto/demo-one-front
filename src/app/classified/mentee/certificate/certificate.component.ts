import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar, MatPaginator, MatTableDataSource } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/user/user.service';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

export interface CertificateElement {
  'name': string;
  'mentee': string;
  'data': object;
}

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.css']
})
export class CertificateComponent implements OnInit {

  
  @ViewChild('fileUpload') fileUpload: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchInput') searchInput: ElementRef;
  certificates: CertificateElement[] = [];
  displayedCertificateColumns: string[] = ['name', 'mentee', 'data'];
  certificateDataSource = new MatTableDataSource(this.certificates);

  persistingData: boolean;
  isConnecting: boolean
  user: object;
  hasError: boolean;
  firstFormGroup: FormGroup;
  programmeDurations = []
  keyRole = 55;
  optionalRole = 55;
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
    this.validateUser()
    this.prepareFormInputValidation()
    this.numberArray = this.fillNumberArray(100)
    this.startPaginator()
    this.getMenteeCertificate()
  }
  

  validateUser(){
    this.isConnecting= true
    const subscription = this.userService.validateUser()
    this.subscription = subscription.subscribe(
      (res)=>{
        this.isConnecting=false
        if(res.code != 200) {
          this.hasError = true
          let message ='Invalid Session, Login Again.'
          this.logUserOut(message);
        }
  
        if(res.code==200) {
          if(!res.body.mentor) {
            this.gotoHome()
          }
          this.inspectRole(res.body.role, 'match')
          this.user = res.body.user
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }

  getMenteeCertificate() {
    this.isConnecting = true
    const subscription = this.userService.menteeCertificates()
    this.subscription = subscription
    .subscribe(
        (res)=>{ 
        if(res.code==200) {
          if(res.body) {
            this.filterBody(res.body)
          } else {  
          }
        } else {     
        }
      },
      (error)=>{
        this.hasError = true
        this.isConnecting = false
        let notification = errorMessage.ConnectionError(error)
        this.openSnackBar(notification, 'snack-error')
  
      });
  }

  filterBody(body:object[]) {
    body.forEach(data=> {
      this.cleanData(data)
    })
  }

  inspectRole(role: any, type: string) {
    if(role[0]) {
      // It is an array
      this.inspectRoleArray(role, type)
    } else if ((role.code == this.keyRole || role.code == this.optionalRole) && type=="unmatch"){
      let message ='Invalid Session, Login Again.'
      this.logUserOut(message);
    } else if ((role.code != this.keyRole && role.code != this.optionalRole) && type=="match"){
      let message ='Invalid Session, Login Again.'
      this.logUserOut(message);
    } 
  }

   
   inspectRoleArray(role: any, type:string){
     let isKey = role.find(x=>{
       return x.code === this.keyRole
     });

     let isOptional = role.find(x=>{
        return x.code === this.optionalRole
      })
   
    if((isKey || isOptional) && type == 'unmatch'){
      let message ='Invalid Session, Login Again.'
      this.logUserOut(message);
    } else if((!isKey && !isOptional) && type == 'match'){
      let message ='Invalid Session, Login Again.'
      this.logUserOut(message);
    }
  }

  gotoHome(){
    this.router.navigateByUrl('/mentee/home')
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


   clearAllFields(){
      this.firstFormGroup.get('name').setValue("");
      this.firstFormGroup.get('link').setValue("");
      this.newCertificate = ''
   }

   onSubmit(){

    if(this.persistingData){return}
  
    if(this.firstFormGroup.invalid){
      let notification = "You have errors in your form"
      this.openSnackBar(notification, 'snack-error')
      return
    }
    
    if(this.newCertificate.length==0) {
      let notification = "You have not uploaded a certificate"
      this.openSnackBar(notification, 'snack-error')
      return 
    }

  
    let data ={
      "name": this.firstFormGroup.controls['name'].value,
      "url": this.firstFormGroup.controls['link'].value,
      "certificate": this.newCertificate,
    }

    
    data.url = data.url.trim()
    let pattern = /^(http|https):\/\//
    if (!data.url.match(pattern)) {
      let notification = "Invalid Certificate Link"
      this.openSnackBar(notification, 'snack-error')
      return 
    }
    
    this.persistData(data)
  
  }
  
  persistData(data: Object){
    this.persistingData = true
    this.userService.saveCertificate(data)
    .subscribe(
      (res)=>{
        this.persistingData = false
        if(res.code != 200) {
          this.hasError = true
          this.showErrorMessage(res)
        }
  
        if(res.code==200) {
          this.cleanData(res.body)
          let notification = res.message
          this.openSnackBar(notification, 'snack-success')
        }
  
    },
    (error)=>{
      this.persistingData = false;
      let notification = errorMessage.ConnectionError(error)
      this.openSnackBar(notification, 'snack-error')
      return
  
    });
  }

  applyFilter(filterValue: string) {
    this.certificateDataSource.filter = filterValue.trim().toLowerCase();
  }

  startPaginator() {
    this.isConnecting = true
    setTimeout(()=>{  
    this.certificateDataSource.paginator = this.paginator;
    this.focusInput()
    this.isConnecting = false
    },500);
  }

  focusInput() {
    if(!this.searchInput){return}
    this.searchInput.nativeElement.focus()
  }

  cleanData(data: object) {
    if(!data) {
      this.isConnecting = false;
      return
    }
      let newData = {
        'name' :  data['name'],
        'mentee' :  data['mentee'],
        'data'  : {link:data['url'], certificate:data['certificate']}
      }
    this.certificates.push(newData)
    this.startPaginator()
    this.clearAllFields()
    this.isConnecting = false
  }

  showErrorMessage(error: object){
    this.persistingData = false;
      let notification = errorMessage.ConnectionError(error)
      this.openSnackBar(notification, 'snack-error')
      return
  
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
    link = link.trim()
    let pattern = /^(http|https):\/\//
    if (!link.match(pattern)) {
      link = 'https://' +link
    }
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
