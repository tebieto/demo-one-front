import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar, MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/shared/user/user.service';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import * as crypto from 'crypto-js';
import { Asset as cryptojs} from 'src/app/asset';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Title } from '@angular/platform-browser';
import { Config } from 'src/app/config';
import { Location } from '@angular/common';


export interface CertificateElement {
  'name': string;
  'mentee': string;
  'data': object;
}
export interface PeriodicElement {
  'name': object;
  'about': string;
  'data': string;
}

export interface ideaElement {
  'title': string;
  'description': string;
  'id': number;
  'link': string;
  'status': string;
  'idea': object;
  'score': string;
  'comment': string;
}

@Component({
  selector: 'app-mentee-report',
  templateUrl: './mentee-report.component.html',
  styleUrls: ['./mentee-report.component.css']
})
export class MenteeReportComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('toMentor') toMentor: ElementRef;
  @ViewChild('toCertificates') toCertificates: ElementRef;
  @ViewChild('toIdeas') toIdeas: ElementRef;
  @ViewChild('toApproved') toApproved: ElementRef;
  mentorList: PeriodicElement[] = [];
  certificates: CertificateElement[] = [];
  approvedList: ideaElement[] = [];
  ideaList: ideaElement[] = [];
  displayedColumns: string[] = ['name', 'about', 'data'];
  certificateColumns: string[] = ['name', 'mentee', 'data'];
  approvedColumns: string[] = ['title', 'description','comment', 'score', 'id'];
  ideaColumns: string[] = ['title', 'description', 'status', 'id'];
  dataSource = new MatTableDataSource(this.mentorList);
  certificateDataSource = new MatTableDataSource(this.certificates);
  approvedDataSource = new MatTableDataSource(this.approvedList);
  ideaDataSource = new MatTableDataSource(this.ideaList);

  applyFilter(filterValue: string, type: string) {
    if(type=='all') {
      this.ideaDataSource.filter = filterValue.trim().toLowerCase();
    } else if(type=='certs') {
      this.certificateDataSource.filter = filterValue.trim().toLowerCase();
    } else if(type=='approved') {
      this.approvedDataSource.filter = filterValue.trim().toLowerCase();
    }
  }


  isConnecting: boolean;
  onStartUpload: boolean;
  persistingData: boolean;
  subscription: Subscription;
  hasMentor: boolean;
  profileCode: string
  learn = Config.mentorLearn;
  user: object;
  hasError: boolean;
  keyRole = 44;
  optionalRole = 44;
  overview = []
  params: object
  profile: object
  allIdeas: object
  page = "mentor"

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private titleService:Title,
    public dialog: MatDialog,
    public _location: Location
    ) {}

  ngOnInit() {
    this.titleService.setTitle('IDEAHUB| Mentor Home')
    this.validateUser()
    this.startCustomRouter()
    this.startPaginator()
  }

  startPaginator() {
    this.isConnecting = true
    setTimeout(()=>{  
      this.certificateDataSource.paginator = this.paginator;
      this.dataSource.paginator = this.paginator;
      this.approvedDataSource.paginator = this.paginator;
      this.ideaDataSource.paginator = this.paginator;
      this.focusInput()
      this.isConnecting = false
      this.onScrollToPage()
      },2000);
  }

  onScrollToPage() {
    if(this.page=='approved-idea') {
      this.scrollToPage('approved')
    }

    if(this.page=='idea') {
      this.scrollToPage('ideas')
    }

    if(this.page=='certificate') {
      this.scrollToPage('certificates')
    }

    if(this.page=='mentor') {
      this.scrollToPage('mentor')
    }
  }

  
  scrollToPage(page: string): void {

    try {
      if(page=='approved') {   
      this.toApproved.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      if(page=='ideas') {   
        this.toIdeas.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      if(page=='certificates') {   
        this.toCertificates.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      if(page=='mentor') {   
        this.toMentor.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    } catch(err) { } 

}

  focusInput() {
    if(!this.searchInput){return}
    this.searchInput.nativeElement.focus()
  }

  validateUser(){
    this.isConnecting= true
    this.userService.validateUser()
    .subscribe(
      (res)=>{
        if(res.code != 200) {
          this.hasError = true
          let message ='Invalid Session, Login Again.'
          this.logUserOut(message);
        }
  
        if(res.code==200) {
          this.inspectRole(res.body.role, 'match')
          this.user = res.body.user
          this.getprofile(this.params['code'])
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }

  getprofile(param: string){
    let code = param
    let secret = this.makeSecret()
    let data = this.decrypt(code, secret)
    this.profile = data['value']['mentee']
    this.getUserOverview(this.profile['id'])
  }

  decrypt(textToDecrypt : string, secret:string){
    this.isConnecting = true
    let data = crypto.AES.decrypt(textToDecrypt.replace(/atala/g,'/'), secret.trim()).toString(crypto.enc.Utf8);

    if(!data) {
      return null
    }
    
    data = JSON.parse(data)
     this.isConnecting = false
    return data
   }
 
    makeSecret() {
     var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return 'atala%'+this.user['id'];
  }


  getUserOverview(id: number){
    this.isConnecting= true
    this.userService.userOverview(id)
    .subscribe(
      (res)=>{
        if(res.code != 200) {
          this.hasError = true
          let message ='Invalid Session, Login Again.'
          this.logUserOut(message);
        }
  
        if(res.code==200) {
          this.manipulateOverview(res.body)
         }
  
    },
    (error)=>{
      this.hasError = true
      this.isConnecting=false;
    });
  }

  manipulateOverview(data: any) {
    data['approved'] = []
    data['certificates'] = []
    data['mentorCount'] = 0
    if(data['mentors'] && data.mentors.id>0) {
      data['mentorCount'] = 1
      let newData = {}
      newData['mentor'] = data.mentors
      newData['profile'] = data.mentorship_profile
      this.cleanMentorData(newData)
    } else {
      data['mentorCount'] = 0
      data['mentors']= []
    }

    if(data.ideas) {
      this.allIdeas = {}
      this.allIdeas['approved'] = []
      this.allIdeas['all'] = []
      this.pushMenteeIdeas(data.ideas)
      this.pushIdea(this.allIdeas['approved'], 'approved')
      this.pushIdea(this.allIdeas['all'], 'all')
    } else {
      data['ideas'] = []
    }


  if(data.program_certificates) {

    data.program_certificates.forEach(cert => {
      if(cert['status']=='approved') {
        this.cleanCertificateData(cert)
      }
    });
  } else {
    data['certificates'] = []
  }
    
    this.overview =data
    this.startPaginator()
    
  }

  cleanMentorData(data: object) {
    if(!data) {
      this.isConnecting = false;
      return
    }
    let encrypted = this.encrypt(data)
    let newData = {
      'name' :  {name:data['mentor']['full_name'], link: encrypted},
      'about' : data['profile']['about_me'],
      'data'  : encrypted
    }
    this.mentorList.push(newData)
  }

  cleanCertificateData(data: object) {
    if(!data) {
      this.isConnecting = false;
      return
    }
      let newData = {
        'name' :  data['name'],
        'mentee' :  data['mentee'],
        'data'  : {id:data['id'], link:data['url'], certificate:data['certificate']}
      }
    this.certificates.push(newData)
  }

   pushMenteeIdeas(idea: object[]) {
    if(!idea) {return}
    idea.forEach(x=> {
      if(x['committee_status']=='approved') {
        this.allIdeas['approved'].push(x)
      }
      this.allIdeas['all'].push(x)
    })
  }


  pushIdea(data: object[], type: string) {
    let ideas = this.ideaList
    if(type=='approved') {
      ideas = this.approvedList
    }
    ideas.splice(0, ideas.length)
    data.forEach(idea=> {
      let encrypted = cryptojs.encrypt(idea, this.user['id'])
      let element = {id:0, description:'', title: '', comment: '', score: '', link: '', status: '', idea:{}}
      element['id']= idea['id']
      element['score']= idea['committee_score']
      element['comment']= idea['committee_comment']
      element['link'] = encrypted
      element['description']= idea['description']
      element['title'] = idea['title']
      element['status'] = idea['status']
      element['idea'] = idea
      ideas.push(element)
    });

  }


  encrypt(value : object) : string{
    let secret = this.makeSecret()
    let d = {secret: secret, value: value}

    let code = JSON.stringify(d)
    let data = {secret: secret, code: crypto.AES.encrypt(code.trim(), secret.trim()).toString().replace(/\//g,'atala')}
    data['link'] = data.code
    return data['link'];
  }
 
  

  logUserOut(message:string){
    this.clearToken()
    let notification = message
    this.openSnackBar(notification, 'snack-error')
    this.router.navigateByUrl('/login')
  }

  pageNotFound(){
    this.clearToken()
    this.router.navigateByUrl('/not-found')
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

  startCustomRouter(){
    this.route.params.subscribe(params=>{
          this.consumeRouteParams(params)
      });
  }

  consumeRouteParams(params: object) {
    this.params = params
    if(params['page'] !='approved-idea' && params['page']!='idea' && params['page']!='mentor' && params['page']!='certificate') {
      this.pageNotFound()
    }
    this.page = params['page']
    return
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

  showErrorMessage(error: object){
    this.persistingData = false;
      let notification = errorMessage.ConnectionError(error)
      this.openSnackBar(notification, 'snack-error')
      return
  
  }

  newTab(link:string) {
    window.open(
      link,
      '_blank' // <- This is what makes it open in a new window or tab.
    );
  }


ngOnDestroy() {
  if(!this.subscription){return}
  this.subscription.unsubscribe();
}

goBack() {
  this._location.back()
}

}
