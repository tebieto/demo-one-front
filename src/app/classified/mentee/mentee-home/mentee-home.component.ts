import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MediaMatcher } from '@angular/cdk/layout';
import { UserService } from 'src/app/shared/user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SnackbarComponent } from 'src/app/extras/snackbar/snackbar.component';
import { CustomErrorHandler as errorMessage} from 'src/app/custom-error-handler';
import { Title } from '@angular/platform-browser';
import { LocationStrategy, PlatformLocation } from '@angular/common';
import Pusher from 'pusher-js';
import { Config } from 'src/app/config';
import { SharedDialogComponent } from 'src/app/shared/shared-dialog/shared-dialog.component';
import { LoginService } from 'src/app/shared/authentication/login.service';


@Component({
  selector: 'app-mentee-home',
  templateUrl: './mentee-home.component.html',
  styleUrls: ['./mentee-home.component.css'],
  encapsulation: ViewEncapsulation.None
})



export class MenteeHomeComponent implements OnInit {
  
  @ViewChild('unreadMessages') unreadMessages: ElementRef;
  @ViewChild('sendMessage') sendMessage: ElementRef;
  @ViewChild('scrollToBottom') private bottomChat: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  @ViewChild('imgUpload') imgUpload: ElementRef;
  @ViewChild('avatarUpload') avatarUpload: ElementRef;

  firstForumGroup: FormGroup;
  secondForumGroup: FormGroup;
  firstIdeaGroup: FormGroup;
  secondIdeaGroup: FormGroup;
  thirdIdeaGroup: FormGroup;
  toForum = false;
  toNewForum = false;
  toIdea= false;
  toNewIdea = false;
  senderMenu= 0;
  conversationMenu = 0
  pinnedTime = ''
  showUnread = false;
  scrollTop: number;
  scrollHeight: number;
  scrollOffset: number;
  searchText: string;
  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource;
  emptySearchError: boolean;
  noContentError: boolean;
  desparity: number;
  sibling: number;
  xActive: number;
  active: number;
  activeForum: number;
  activeIdea: number;
  searchResult = []
  activeConversation: object;
  activatedIdea: object;
  conversations = [];
  forums= []
  ideas= []
  pinnedConversations = [];
  typedMessage = ''
  parentMessage = {}
  newForumStatus = true
  newIdeaPlan = ''
  newIdeaLogo = ''
  activeType = 'chat'
  ideaPanel: boolean;
  isUploadingImage: boolean;
  isUploadingFile: boolean;
  industries= [];
  pendingIdea: boolean;
  pendingForum: boolean;
  authUser: any
  keyRole = 55;
  optionalRole = 55;
  hideMobileLeft: boolean;
  ideaDatas = [];
  editableIdea = 0
  forumDatas = [];

  datas = [];
  


  isConnecting: boolean;
  subscription: Subscription;

  user: object;
  hasError: boolean;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  isUploadingAvatar: boolean;
  newAvatar: any;
  previousAvatar: any;
  hasMentor: boolean;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private titleService:Title, 
    private changeDetectorRef: ChangeDetectorRef, 
    private media: MediaMatcher,
    private locationStrategy: LocationStrategy,
    backClick: PlatformLocation,
    public dialog: MatDialog,
    private loginService: LoginService
    ) {
      this.mobileQuery = media.matchMedia('(max-width: 1024px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
      backClick.onPopState(() => {

        this.toggleChat()

    });
    }


        ngOnInit() {
          this.preventBackButton()
          this.titleService.setTitle('IDEAHUB| Mentee Main Board')
          this.validateUser()
          this.manipulateDatas('chat', this.datas);
          this.fetchChats()
          this.fetchForums()
          this.fetchIdeas()
          this.populateSource('chat');
          this.activateFormGroups();
          this.fetchIndustry()
          this.hasPendingIdea()
          this.startCustomRouter()
        }

        startCustomRouter(){
          this.route.params.subscribe(params=>{
                this.consumeRouteParams(params)
            });
        }
      
        consumeRouteParams(params: object) {
          if(params['page']) {
            setTimeout(() => {
              
            if(params['page']=='idea') {
              this.gotoIdea()
            }

            if(params['page']=='forum') {
              this.gotoForum()
            }

            }, 2000);
          }
        }

        activateChannel(id:number, type: string) {
          let pusher = new Pusher(Config.pusher.key, {
            cluster: Config.pusher.cluster,
            forceTLS: true
          });
          let channel = pusher.subscribe(id+'');
          channel.bind(type, data => {
          if(type=='notification') {
            let url = '/mentee'
            this.openDataPage(data)
            this.userService.notifyMe(data, url)
            return
            }
          if(data.sender.id==this.authUser.id) {return}
          if(data.type=='forum') {
            data['recipient_id'] = this.authUser['id']
          }
          this.cleanPushedMessage(data)
          this.playChatSound()
          });
        }

        openDataPage(data:object) {
          if(data['type']=='idea') {
            this.fetchIdeas()
            this.gotoIdea()
            this.hasPendingIdea()
          }
        }

        playChatSound() {
          let audio = new Audio();
          audio.src = "/assets/sound/ideahub_chat.mp3";
          audio.load();
          audio.play();
        }

        cleanPushedMessage(data: object) {

          let now = this.utcNow()
          let newMessage = {
            id: data['id'],
            sender_id: data['sender_id'],
            recipient_id: data['recipient_id'],
            sender: data['sender'],
            message: data['message'],
            created_at: now,
            status: 'delivered',
            unread: true,
            starred: false,
            parent: data['parent'],
            type: data['type'] 
          }
          
          this.pushToConversation(newMessage)
        }

       
        
        toggleChat() {
          if(this.hideMobileLeft==true) {
            return this.hideMobileLeft = false;
          }
          return this.hideMobileLeft = true;
       }
       

        pushToConversation(data: object){
        let available = {}
        if(data['type']=="chat") { 
        available = this.conversations.find(c=>{
          return (c.sender.id == data['sender_id'] && c.recipient.id==data['recipient_id'])
        });
        } else if(data['type']=="forum") { 
          available = this.forums.find(c=>{
            return (c.sender.id == data['sender_id'] && c.recipient.id==data['recipient_id'])
          });
          }

          if(available){

            // Too Late
            if(this.getGroupTime(data['created_at'])!='Today') {return}

            //Check if latest data was sent same day as the latest
            if(this.getGroupTime(available['latest']['created_at']) == this.getGroupTime(data['created_at'])) {
              data['groupTime'] = false;
            } else {
              data['groupTime'] = true;
            }

            
            
            // if data is going into opened chat 
            if(data['sender_id']==this.active){
              data['unread'] = false;
              if(this.mobileQuery.matches && !this.hideMobileLeft) {
                data['unread'] = true;
              }
              //was it sent by same user consecutively?

              if( available['latest']['sender']['id']!=data['sender']['id']) {
              data['desparity']= true;
              }

              available['unread']+=1

              // Because they cannot be siblings if they are sent on different days
              if(data['groupTime']==false) {
                
                if( available['sender']['id']==data['sender']['id']) {

                  if(data['sender']['id'] == available['latest']['sender']['id']) {
                    data['sibling']= true;
                  }

                }
              }

              //get the processed time
              data['time']=this.getChatTime(data['created_at']);
            }


            if(available['latest'] = data){
              available['latest']['time'] = this.getLocalTime(available['latest']['created_at']);
              available['created_at'] = available['latest']['created_at'];
              this.sortData(this.conversations);
              this.conversations = this.fixPinned(this.conversations);
            }

            if(data['parent']>0) {

              let parent  = this.activeConversation['conversation'].find((x)=> {
                return x.id == data['parent']
              });
  
              if(parent) {
                data['parent_info'] = parent
              }

            }
            
            
            available['conversation'].push(data);

            available['unread_count']+=1;
            
          } else {

            // FindConversation

          }
          
          this.backToBottom()
          setTimeout(()=> {
            this.backToBottom()
          }, 1000)
        }


        tooLate(previous:Date, next:Date) {

              let prev = new Date(previous).getTime()/(24*60*60*10*10*10)
              let nex = new Date(next).getTime()/(24*60*60*10*10*10)
              if(prev>nex) {
                let difference = prev - nex
                if(difference>=1) {
                  return true
                }
              }

              return false
        }



        manipulateDatas(type:string, datas: object[]){
          if(datas.length==0) {return}
          if(type=="idea") {
            this.ideas = datas
              this.sortData(this.ideas);
              this.ideas = this.fixPinned(this.ideas)
            return
          }
          
          let manipulated = []
          if(manipulated = this.refineDatas(datas)) {

            try {

            if(type=='chat') {
              this.conversations = manipulated
              this.sortData(this.conversations);
              this.conversations = this.fixPinned(this.conversations)
            } else if(type=='forum') {
              this.forums = manipulated
              this.sortData(this.forums);
              this.forums = this.fixPinned(this.forums)
            } else {
              return
            }

          } catch(err) { 
            console.log(err)
          }  
          }
          

        }
        

        fixPinned(datas: object[]): object[] {
          let pinned = [];
          let final = [];

          datas.forEach(x=> {
            if(x['pinned']==true) {
              pinned.push(x)
            } else {
              final.push(x)
            }

          });

          if(pinned.length==0){
            return datas
          }

          let reversedFinal = final.reverse()
          let reversedPinned = pinned.reverse()

          reversedPinned.forEach(x=> {
            reversedFinal.push(x);
          });

          final = reversedFinal.reverse()

          return final;
          
        }



        refineDatas(datas: object[]): object[]{
          
          let unread = 0

          datas.forEach(data=>{

            data['search'] = data['sender']['name'];

          let sortedData =  this.sortData(data['conversation'])

          // Count unread data

          sortedData.forEach(x=> {

            if(x['unread']==true) {
              unread+=1
            }

          });

          data['unread_count']= unread;
          
          if(data['latest'] = sortedData[0]){
            data['latest']['time'] = this.getLocalTime(data['latest']['created_at'])
            data['created_at'] = data['latest']['created_at']
          }
          
          });

          return datas;


        }



        getChatTime(time: string): any{

          let UTCString = new Date(time.replace(/ /g,"T")+'Z')

          return this.fetchTime(UTCString);
        }



        getGroupTime(time: string): any{
          let now = new Date().getTime()
              let UTCString = new Date(time.replace(/ /g,"T")+'Z')
              let previous = UTCString.getTime()
              let difference = now -previous
              let week_difference = difference / (7*24*60*60*10*10*10)
              let day_difference = difference / (24*60*60*10*10*10)
              let hour_difference = difference / (60*60*10*10*10)

              if(day_difference<1){
                if(hour_difference>12 && UTCString.getHours()>12) {
                  return 'Yesterday';
                } else {
                    return 'Today';
                  }
              }

              if(day_difference>=1 && day_difference<2){
                return 'Yesterday';
              }

              if(week_difference<=1) {
                return this.fetchDay(UTCString);
              }
              return this.fetchDate(UTCString);

        }



        getLocalTime(time: string): any{
            
              let now = new Date().getTime()
              let UTCString = new Date(time.replace(/ /g,"T")+'Z')
              let previous = UTCString.getTime()
              let difference = now -previous
              let second_difference = difference / (10*10*10)
              let week_difference = difference / (7*24*60*60*10*10*10)
              let day_difference = difference / (24*60*60*10*10*10)
              let hour_difference = difference / (60*60*10*10*10)

              if(second_difference<1){
                return 'Now';
              }

              if(day_difference<1){
                return this.fetchTime(UTCString);
              }

              if(day_difference>=1 && day_difference<2){
                return 'Yesterday';
              }

              if(week_difference<=1) {
                return this.fetchDay(UTCString);
              }
              return this.fetchDate(UTCString);

        }






        fetchTime(date: Date){

            let suffix = 'AM'
            let time =''
            let hours = date.getHours()
              
            if(hours>=12){
                suffix = 'PM'
              }
              
              if(hours>12){
                hours = hours-12
              }
            let append = ''
            let min = date.getMinutes()
            if(min<10){
              append='0'
            }
            time = hours+':'+append+''+min + ' ' + suffix;

            return time;

        }






        fetchDay(date: Date){
          let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
          return days[date.getDay()]
        }






        fetchDate(date: Date){
        let months = ['01','02','03','04','05','06','07','08','09','10','11','12']
        return date.getDate()+'/'+months[date.getMonth()]+'/'+date.getFullYear()
        }






        sortData(data: Object[]): object[] {

          return data.sort((a,b)=>{
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            let sorted = <any>new Date(b['created_at']) - <any>new Date(a['created_at']);
            return sorted
          });

        }

        reverseSortData(data: Object[]): object[] {

          return data.sort((a,b)=>{
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            let sorted = <any>new Date(a['created_at']) - <any>new Date(b['created_at']);

            return sorted
          });

        }





        replaceMatch(type: string, name:string){
          let regX = new RegExp(this.searchText.trim(), "i")
          let match = name.match(regX)

          if(match) {  
          let colored = '<span class="colored">'+match[0]+'</span>'
          let matched = name.replace(regX, colored)
          return matched;
          } else {
            return name;
          }
        }


        populateSource(type: string){
          if(type=="chat") {
            this.dataSource.data = this.conversations
          } else if(type=="forum") {
            this.dataSource.data = this.forums
          } else if(type=="idea") {
            this.dataSource.data = this.ideas
          } else {
            return
          }
        }


        applyFilter(filterValue: string) {

          this.searchResult = []
          this.dataSource.filter = filterValue.trim().toLowerCase();


            if(this.dataSource.filteredData.length>0){
              
                this.dataSource.filteredData.forEach(data=>{
                  this.searchResult.push(data)
                });

                this.emptySearchError = false
                return

            } else {
              if(this.noContentError==true){return}
              this.emptySearchError = true
              return
            }


        }




        openChat(type:string, id: number) {
          
            this.hideMobileLeft = true
            this.ideaPanel = false;
            this.typedMessage = '';
            this.parentMessage = {};
            this.desparity =  0;
            this.scrollHeight = 0;
            this.scrollTop = 0;
            let activeChat = [];
            let activateChat = [];
            
            if(type=="chat") {
              this.xActive = this.active;
            } else if(type=="forum") {
              this.xActive = this.activeForum
            } else if(type=="idea") {
              this.xActive = this.activeIdea
            } else {
              return
            }
            

          // deactivate active chat

          // Active Deactivation 
          
          if(this.activeConversation) {   
            this.activeConversation['active'] = false;
          }

          if(this.activatedIdea) {   
            this.activatedIdea['active'] = false;
          }

          // Global deactivation

              if(this.xActive) {

                if (type=='chat') {

                   activeChat  = this.conversations.find((x)=> {
                    return x.sender.id == this.active
                  });

                  if(activeChat) {
                    activeChat['active'] = false;
                  } 

                } else if(type=='forum') {
                   activeChat  = this.forums.find((x)=> {
                    return x.sender.id == this.activeForum
                  });

                  if(activeChat) {
                    activeChat['active'] = false;
                  } 

                } else if(type=='idea') {

                  activeChat  = this.ideas.find((x)=> {
                   return x.id == this.activeIdea
                 });

                 if(activeChat) {
                   activeChat['active'] = false;
                 } 

               } else {
                  return
                }

              }


          // Activate clicked chat

          if(type =='chat') {

             activateChat  = this.conversations.find((x)=> {
              return x.sender.id == id;

            });
          } else if(type=='forum') {
            
             activateChat  = this.forums.find((x)=> {
              return x.sender.id == id
            });

          } else if(type=='idea') {

            activateChat  = this.ideas.find((x)=> {
             return x.id == id
           });

         }


          if(activateChat) {
                if(type=="forum" && activateChat['listening']==false) {
                  activateChat['listening']=true;
                  this.activateChannel(id,type)
                }

                activateChat['active'] = true;

                if(type=='idea') {
                  this.activatedIdea = activateChat
                  this.activeIdea = id
                  this.ideaPanel = true
                  return
                }

                this.activeConversation = [];
                this.sibling = 0;
                this.desparity = 0;

                let unread = 0;
                let compareTime = ''
                
                let descendingOrder = this.reverseSortData(activateChat['conversation']);
                activateChat['conversation'] = descendingOrder;

                activateChat['conversation'].forEach(message=>{
                  if(message.parent>0) {
                  let parent  = activateChat['conversation'].find((x)=> {
                    return x.id == message.parent
                  });

                  if(parent) {
                    message['parent_info'] = parent
                  }


                  }

                  if(message['type']=='forum') { 
                  message['status'] = 'delivered' 
                  message['classifiedUser']=this.manipulateMessageRoles(message['role'])
                  }

                  message['desparity']= this.checkDesparity(message.sender.id);
                  message['time']=this.getChatTime(message['created_at']);
                  message['showUnread'] = false;
                  message['sibling']= this.checkSibling(message.sender.id);
                  
                  let newTime = this.getGroupTime(message['created_at']);
                  
                  if(compareTime == newTime ){
                    
                    message['groupTime']=false
                  } else {
                    
                    message['groupTime']=true
                    compareTime = newTime
                    message['sibling']= false
                  }
      
                  // message['unread'] is to track unread after chat has been clicked
                  
                  if(unread==0 && message['unread']==true) {
                    message['showUnread'] = true
                    unread += 1;
                  } else if(message['unread']==true){
                    unread += 1;
                  }
                  message['unread'] = false;
                });

                activateChat['unread'] = unread;

                if(unread>0){
                  // Show unread div
                  this.showUnread = true
                } else {
                  //Hide unread div
                  this.showUnread = false
                }
                
                
                this.activeConversation=activateChat;

                //message['unread_count'] is to track before a conversation is clicked
                this.activeConversation['unread_count'] = 0;

                setTimeout(()=>{
                  this.focusInput('')
                },1)

          } 


            if(type=="chat") {
              this.active = id
            } else if(type=="forum") {
              this.activeForum = id
            }

            if(!this.showUnread){
              setTimeout(()=>{
                this.scrollToBottom()
              },1)
            } else {

              // Scroll to Unread messages

              setTimeout(()=>{
                this.scrollToUnreadMessages()
              },100)
              

              // Remove unread div after timeout
              setTimeout(()=>{
                
                if(this.showUnread==true) {
                  this.showUnread=false;
                  }

              },10000)
            }

            return

        }



        manipulateMessageRoles(roles: object[]) {
        if(!roles) {
          return false;
        }
        let valid = roles.find(role=> {
            return role['code'] > 55
          });
        
          if(valid) {
          return true;
          } else {
            return false;
          }
        }


        checkDesparity(id: number) {

            if(this.desparity == 0){
              this.desparity= id;
              return false
            }

            if(this.desparity == id) {
              this.desparity= id;
              return false
            }

            if(this.desparity != id) {
              this.desparity= id;
              return true
            }

        }






        checkSibling(id: number) {

            if(this.sibling==0){
              this.sibling= id;
              return false
            }

            if(this.sibling == id) {
              this.sibling= id;
              return true
            }

            if(this.sibling != id) {
              this.sibling= id;
              return false
            }

        }


        pinChat(type: string, id: number) {
          
          let c = {}

          if(type == 'chat') {

             c  = this.conversations.find((x)=> {
              return x.sender.id == id
            });

          } else if(type == 'forum') {

             c  = this.forums.find((x)=> {
              return x.sender.id == id
            });
          } else if(type == 'idea') {

            c  = this.ideas.find((x)=> {
             return x.id == id
           });
         }
          

          if(!c) {return}

          c['pinned'] = true;

          if(type=='chat') {

            this.sortData(this.conversations)
            this.conversations = this.fixPinned(this.conversations)
            
          } else if(type=="forum") {

            this.sortData(this.forums)
            this.forums = this.fixPinned(this.forums)
            
          } else if(type=="idea") {

            this.sortData(this.ideas)
            this.ideas = this.fixPinned(this.ideas)
            
          }

        }

        unPinChat(type: string, id: number) {
          
          let c = {}

          if(type == 'chat') {

             c  = this.conversations.find((x)=> {
              return x.sender.id == id
            });

          } else if(type == 'forum') {

             c  = this.forums.find((x)=> {
              return x.sender.id == id
            });
          } else if(type == 'idea') {

            c  = this.ideas.find((x)=> {
             return x.id == id
           });
         }

          if(!c) {return}

          c['pinned'] = false;

          if(type=='chat') {

            this.sortData(this.conversations)
            this.conversations = this.fixPinned(this.conversations)

          } else if(type=="forum") {

            this.sortData(this.forums)
            this.forums = this.fixPinned(this.forums)
            
          } else if(type=="idea") {

            this.sortData(this.ideas)
            this.ideas = this.fixPinned(this.ideas)
            
          }
        }

        starMessage(id: number) {
          
          let c  = this.activeConversation['conversation'].find((x)=> {
            return x.id == id
          });

          if(!c) {return}

          c['starred'] = true;

        }

        unstarMessage(id: number) {
          
          let c  = this.activeConversation['conversation'].find((x)=> {
            return x.id == id
          });

          if(!c) {return}

          c['starred'] = false;

        }

        messageMenuOpened(id: number) {
          this.conversationMenu = id
        }

        menuOpened(id: number) {
          this.senderMenu = id
        }

        hideChatMenus() {
          this.senderMenu = 0
          this.conversationMenu = 0
        }






        onScroll(e: ElementRef){
          this.scrollTop = e['target']['scrollTop'] 
          this.scrollHeight = e['target']['scrollHeight']
          this.scrollOffset = e['target']['offsetHeight']
          this.scrollHeight = this.scrollHeight - this.scrollOffset - 1
          this.getPinnedIme(e)

          if(this.scrollTop==0){
            // request more data
          }

        }

        focusInput(e){
          if(e.key=='ArrowUp' || e.key=='ArrowDown') {
            return
          }
          this.sendMessage.nativeElement.focus()
        }


        getPinnedIme(e: ElementRef) {
          let el = e
          let count= el['target']['childElementCount']
          count = parseInt(count)

          for(let i=count-1; i>=0; --i) {
            let string= el['target']['children'][i]['lastElementChild']['title'];
            let top= el['target']['children'][i]['lastElementChild']['offsetTop'];
            top = parseInt(top)
          
            if(top<this.scrollTop) {
              let range = this.scrollTop/top

              if(range>0 && range<100 && range<1.5) {
              
              this.pinnedTime=''
              this.pinnedTime = string

              }
            }
            
          }

        if(this.scrollTop==0) {
          this.pinnedTime = ''
        }

        if(this.scrollTop>=this.scrollHeight) {
          this.pinnedTime = ''
        }
        }


        onLeftScroll(e: ElementRef){

          let leftScrollTop = e['target']['scrollTop'] 
          let leftScrollHeight = e['target']['scrollHeight']
          let leftScrollOffset = e['target']['offsetHeight']
          leftScrollHeight = leftScrollHeight - leftScrollOffset

          if(leftScrollTop>=leftScrollHeight){
            // request more data
          }

      }




        scrollToBottom(): void {

            try {
                this.bottomChat.nativeElement.scrollTop = this.bottomChat.nativeElement.scrollHeight;
            } catch(err) { } 

        }

        scrollToUnreadMessages(): void {


          try {
            this.bottomChat.nativeElement.scrollTop = this.unreadMessages.nativeElement.offsetParent.offsetTop-20;
          } catch(err) { } 

      }



        backToBottom(){

              try {
                this.bottomChat.nativeElement.scrollTop = this.bottomChat.nativeElement.scrollHeight;
            } catch(err) { }   

        }

        scrollToChat(id: string) {

          let  el: HTMLElement = document.getElementById(id);
          
          try {
          this.bottomChat.nativeElement.scrollTop = el.offsetTop-20;
        } catch(err) { } 
        
        
        }


        submitMessage(){
          
            if(this.typedMessage.length==0){return}
              let  now = this.utcNow()
              let parentId = 0

             if(this.parentMessage['id']>0) {
             parentId =  this.parentMessage['id']
             }

              let newMessage = {
                  id: null,
                  sender_id: this.authUser.id,
                  recipient_id: this.activeConversation['sender']['id'],
                  sender: {
                    id: this.authUser.id,
                    name: this.authUser.name,
                    avatar: this.authUser.avatar
                  },
                  message: this.typedMessage,
                  created_at: now,
                  status: 'pending',
                  unread: true,
                  starred: false,
                  parent: parentId,
                  type: this.activeConversation['type']
            }

            let forum_id = 0

            if(this.activeConversation['type'] == 'forum') {
              forum_id = this.activeForum
            }

          let  data = {
              message: newMessage.message,
              forum_id: forum_id,
              recipient_id: newMessage.recipient_id,
              parent: newMessage.parent
            }
            
        this.persistConversation(newMessage.type, data)
        this.newToConversation(newMessage)
        this.typedMessage = '';
        this.parentMessage = {}

        setTimeout(()=>{  
        this.backToBottom();
        },1);
        
      }

      persistConversation(type: string, data:object) {
        if(type=='forum') {
          this.persistForumMessage(data)
        }

        if(type=='chat') {
          this.persistChatMessage(data)
        }
      }
      

      utcNow() {

        let now = new Date()
        let months = ['01','02','03','04','05','06','07','08','09','10','11','12']
        let date = this.appendZero(now.getUTCFullYear())+'-'+this.appendZero(parseInt(months[now.getUTCMonth()]))+'-'+this.appendZero(now.getUTCDate())+' '+ this.appendZero(now.getUTCHours())+':'+this.appendZero(now.getUTCMinutes())+':'+this.appendZero(now.getUTCSeconds())
        return date;
      }

      reformatTime(time:string) {
        let newTime = time
        let reformat = [
          {find: '-1-', replace: '-01-', find2: '-1 ', replace2: '-01 '},
          {find: '-2-', replace: '-02-', find2: '-2 ', replace2: '-02 '},
          {find: '-3-', replace: '-03-', find2: '-3 ', replace2: '-03 '},
          {find: '-4-', replace: '-04-', find2: '-4 ', replace2: '-04 '},
          {find: '-5-', replace: '-05-', find2: '-5 ', replace2: '-05 '},
          {find: '-6-', replace: '-06-', find2: '-6 ', replace2: '-06 '},
          {find: '-7-', replace: '-07-', find2: '-7 ', replace2: '-07 '},
          {find: '-8-', replace: '-08-', find2: '-8 ', replace2: '-08 '},
          {find: '-9-', replace: '-09-', find2: '-9 ', replace2: '-09 '},
        ]

        reformat.forEach(x=> {
          let regX = new RegExp(x.find, "i")
          let match = time.match(regX)
          if(match) {  
            let matched = newTime.replace(regX, x.replace);
            newTime = matched;
            }

          //Have to to run regX again for second probability
          regX = new RegExp(x.find2, "i")
          match = newTime.match(regX) 
          if(match) {
            let matched = newTime.replace(regX, x.replace2);
            newTime = matched;
          }
           
        });

        return newTime
        
      }

      appendZero(num: number){
        if(num<10){
          return '0'+num
        }

        return num
      }


      newToConversation(data: object){
        let available = false

        if(this.activeConversation['type'] == 'chat') {
          this.xActive = this.active
          this.activeForum = 0
          available = this.conversations.find(c=>{
            return (c.sender.id == data['recipient_id'] && c.recipient.id==data['sender_id']);
        });

        } else if(this.activeConversation['type'] == 'forum') {
          data['role'] = this.authUser['role'];
          this.xActive = this.activeForum
          available = this.forums.find(c=>{
            return (c.sender.id == data['recipient_id'] && c.recipient.id==data['sender_id']);
        });

        } else {
          return;
        }
        

        if(available){
          
          // Too Late
          if(this.getGroupTime(data['created_at'])!='Today') {return}
          
          //Check if latest data was sent same day as the latest
          if(this.getGroupTime(available['latest']['created_at']) != this.getGroupTime(data['created_at'])) {
            data['groupTime'] = true;
          } else {
            data['groupTime'] = false;
          }
          

          
          // if data is going into opened chat 
          if(data['recipient_id']==this.xActive){
            
            data['unread'] = false;

            //was it sent by same user consecutively?

            if(available['latest']['sender']['id']!=data['sender']['id']) {
              data['desparity']= true
            }
            
            // Because they cannot be siblings if they are sent on different days
            if(data['groupTime']==false) {
              if(available['latest']['sender']['id']==data['sender']['id']) {
                
                data['sibling']= true
              }
            }

            //get the processed time
            data['time']=this.getChatTime(data['created_at']);
            
          }


          if(available['latest'] = data){
            available['latest']['time'] = this.getLocalTime(available['latest']['created_at']);
            available['created_at'] = available['latest']['created_at'];

            
            if(this.activeConversation['type'] == 'chat') {

            this.sortData(this.conversations);
            this.conversations = this.fixPinned(this.conversations);
    
            } else if(this.activeConversation['type'] == 'forum') {
      
            this.sortData(this.forums);
            this.forums = this.fixPinned(this.forums);
    
            } else {
              return
            }
            
          }

          if(data['parent']>0) {

            let parent  = this.activeConversation['conversation'].find((x)=> {
              return x.id == data['parent']
            });

            if(parent) {
              data['parent_info'] = parent
            }

          }
          
          available['conversation'].push(data);

          
        } else {

          // Do nothing

        }

      }


      cancelReply(){
        this.sendMessage.nativeElement.focus()
        this.parentMessage = {}

      }

      replyMessage(id: number) {
        this.sendMessage.nativeElement.focus()

        let message  = this.activeConversation['conversation'].find((x)=> {
          return x.id == id
        })

        if(!message){return}

        this.parentMessage = message

      }

      gotoForum (){
        this.searchText = ''
        this.activeType= 'forum'
        this.toNewForum = false;
        this.toForum = true;
        this.toIdea = false;
        this.populateSource('forum')
      }

      gotoIdea (){
        this.searchText = ''
        this.activeType= 'idea'
        this.toNewIdea = false;
        this.toForum = false;
        this.toIdea = true;
        this.populateSource('idea')
      }

      gotoConversation() {
        this.searchText = ''
        this.activeType = 'chat'
        this.toForum = false;
        this.toIdea = false;
        this.populateSource('chat')
      }

      gotoNewForum() {
        this.toNewForum = true;
      }

      gotoNewIdea(type:string) {
        if(type=='new' && this.editableIdea>0) {
          this.clearEditable()
        }
        this.toNewIdea = true;
      }

      clearEditable() {
      this.firstIdeaGroup.get('title').setValue("");
      this.firstIdeaGroup.get('industry').setValue("");
      this.secondIdeaGroup.get('summary').setValue("");
      this.thirdIdeaGroup.get('website').setValue("");
      this.newIdeaPlan = "";
      this.newIdeaLogo = "";
      this.editableIdea = 0
      }

      
      activateFormGroups() {

        this.firstForumGroup = this._formBuilder.group({
          topic: ['', [Validators.required]]
        });
        this.secondForumGroup = this._formBuilder.group({
          message: ['', [Validators.required, Validators.minLength(20)]]
        });

        this.firstIdeaGroup = this._formBuilder.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          industry: ['', [Validators.required]]
        });
        this.secondIdeaGroup = this._formBuilder.group({
          summary: ['', [Validators.required, Validators.minLength(20)]]
        });
        this.thirdIdeaGroup = this._formBuilder.group({
          website: ['', []]
        });
      }

      getSliderChange(e) {
        this.newForumStatus=e['checked'];
      }

      postNew(type:string) {
        
        if(type=='idea') {
          this.postToIdea()
          return
        }

        let  now = this.utcNow();

        let data = {
          'topic': this.firstForumGroup.controls['topic'].value,
          'message': this.secondForumGroup.controls['message'].value,
          'status': this.newForumStatus,
          'pinned': false,
          'type': 'forum'
        }

        if(data.topic.length==0 || data.message.length==0){  

          let notification = "All fields are required"
          this.openSnackBar(notification, 'snack-error')
          return
        } 

        let forumData = {
          sender: {
            id: null,
            name: data.topic,
            avatar: ""
          },
          recipient: {
            id: this.authUser.id,
            name: this.authUser.name,
            avatar: this.authUser.avatar
          },
          owner: this.authUser.id,
          conversation: [
            {
              id: null,
              sender_id: null,
              recipient_id: this.authUser.id,
              sender: {
                id: this.authUser.id,
                name: this.authUser.name,
                avatar: this.authUser.avatar
              },
              message: data.message,
              created_at: now,
              status: "pending",
              unread: false,
              starred: false,
              parent: 0,
              type: 'forum'
            }
        ],
          active: false,
          pinned: true,
          listening: false,
          type: 'forum'
        }

        
        this.pushToData('forum', forumData)
        this.gotoForum();
        this.clearFormData('forum');
        this.persistForum(data)
      }

      postToIdea() {
        let  now = this.utcNow();

        let data = {
          'id': this.editableIdea,
          'title': this.firstIdeaGroup.controls['title'].value,
          'industry': this.firstIdeaGroup.controls['industry'].value,
          'summary': this.secondIdeaGroup.controls['summary'].value,
          'url': this.thirdIdeaGroup.controls['website'].value,
          'attachment': this.newIdeaPlan,
          'logo': this.newIdeaLogo,
          'type': 'idea',
          'pinned': false,
          'status': 'pending'
        }

        if(data.title.length==0 || data.industry.length==0 || data.summary.length==0){      
          
          let notification = "You have errors in your form"

          this.openSnackBar(notification, 'snack-error')
          return
        }


        if (this.editableIdea>0) {
          this.updateIdea(data)
          return
        }

        let ideaData = {
          id: null,
          owner: this.authUser,
          'industry': this.firstIdeaGroup.controls['industry'].value,
          'title': this.firstIdeaGroup.controls['title'].value,
          'logo': this.newIdeaLogo,
          'summary': this.secondIdeaGroup.controls['summary'].value,
          'url': this.thirdIdeaGroup.controls['website'].value,
          'attachment': this.newIdeaPlan,
          status:"pending",
          active: false,
          pinned: false,
          type: 'idea',
          created_at: now
        }

        this.persistIdea(data)
        this.pushToData('idea', ideaData)
        this.gotoIdea();
        this.clearFormData('idea');

      }

      pushToData(type:string, data: any) {

        if(type=='forum') {
          this.forumDatas.push(data);
          this.manipulateDatas('forum', this.forumDatas);
          this.populateSource('forum');
        } else if(type=='chat') {
          this.datas.push(data);
          this.manipulateDatas('chat', this.datas);
          this.populateSource('chat');
        } else if(type=='idea') {
          this.ideas.push(data);
          this.manipulateDatas('idea', this.ideas);
          this.populateSource('idea');
        }

      }

      clearFormData(type: string) {
        if(type=='forum') {
          this.firstForumGroup.get('topic').setValue('');
          this.secondForumGroup.get('message').setValue('');
          this.newForumStatus = true;
        } else if(type=='idea') {
          this.firstIdeaGroup.get('title').setValue('');
          this.firstIdeaGroup.get('industry').setValue('');
          this.secondIdeaGroup.get('summary').setValue('');
          this.thirdIdeaGroup.get('website').setValue('');
          this.newIdeaPlan = '';
          this.newIdeaLogo = '';
        }
        
      }


      startDirectConversation(id: number) {
        let isValid = this.activeConversation['conversation'].find((x)=> {
          return x.sender.id == id
        });

        if(!isValid) {return}


        let isStarted = this.conversations.find((x)=> {
          return x.sender.id == id
        });

        if(isStarted) {
          this.openChat('chat', id)
        } else if(!isStarted) {
          
          this.startNewDirect(isValid, 'clicked')
      
        }
      }


      startNewDirect(data: object, type: string) {
        let now = this.utcNow()
        let newDirect = {
          sender: {
            id: data['sender'].id,
            name: data['sender'].name,
            avatar: data['sender'].avatar
          },
          recipient: {
            id: this.authUser.id,
            name: this.authUser.name,
            avatar: this.authUser.avatar
          },
          owner: data['sender'].id,
          conversation: [
            {
              id: this.authUser.id,
              sender_id: this.authUser.id,
              recipient_id: this.authUser.id,
              sender: {
                id: this.authUser.id,
                name: this.authUser.name,
                avatar: this.authUser.avatar
              },
              message: "Start Chat with "+ data['sender'].name,
              created_at: now,
              status: 'void',
              void: true,
              unread: false,
              starred: false,
              parent: 0,
              type: 'chat'
            },
          ],
          active: false,
          pinned: false,
          type: 'chat'
        }

        this.pushToData('chat', newDirect)
        if(type=='init') {return}
        setTimeout(()=>{  
          this.openChat('chat', data['sender'].id)
          },1);

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
              this.hasMentor = true;
              if(!res.body.mentor) {
                //this.gotoHome()
                this.hasMentor = false;
              }
              this.inspectRole(res.body.role, 'match')
              this.user = res.body.user
              this.authUser=this.user
              this.authUser['name'] = this.authUser['full_name'];
              this.authUser['avatar'] = this.authUser['image']
              this.authUser['role'] = res.body.role
              setTimeout(()=>{  
                this.activateChannel(this.authUser['id'], 'chat')
                this.activateChannel(this.authUser['id'], 'notification')
                },2000);
             }
      
        },
        (error)=>{
          this.hasError = true
          this.isConnecting=false;
        });
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
          duration: 4000
        })
      }
      onFileUpload() {
          if(this.isUploadingFile){return}
          let el: HTMLElement = this.fileUpload.nativeElement;
          el.click();
      }
      onChooseFile(e) {
          var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
          if(!file){return}
          let size = this.byteToMb(file.size)
          var reader = new FileReader();
          reader.readAsBinaryString(file)

          if(size>1) {
            this.fileSizeError()
            this.newIdeaPlan = ''
            return
          }
          var pattern = /.pdf/;
          const formData: FormData = new FormData();
          if (!file.name.match(pattern)) {
            alert('invalid format');
            return;
          }
          formData.append('file', file, file.name)

          reader.onloadend = ()=>{
            var binary =''+reader.result
            if(binary) {
              let  pageCount = binary.match(/\/Type\s*\/Page\b/g).length;
              if(pageCount>1) {
              this.pageCountError()
              this.newIdeaPlan = ''
              return
              }
            }
            this.persistFileData(formData);
            e.srcElement.value = '';
        }
      }

      byteToMb(byte: number) {
        return byte/1024/1024
      }

      fileSizeError() {
        let notification = 'File too large, Max. size is 1mb'
        this.openSnackBar(notification, 'snack-error')
      }

      pageCountError() {
        let notification = 'PDF must be maximum of 1 page.'
        this.openSnackBar(notification, 'snack-error')
      }
      persistFileData(data) {
        this.isUploadingFile = true
        const subscription = this.userService.uploadFile(data)
        this.subscription = subscription
        .subscribe(
            (res)=>{
              this.isUploadingFile = false;
              this.newIdeaPlan = res.body;
          },
          (error)=>{
            this.isUploadingFile = false;
            let notification = errorMessage.ConnectionError(error)
            this.openSnackBar(notification, 'snack-error')
      
          });
      }

      onImageUpload() {
    
        if(this.isUploadingImage==true) {return}
        let el: HTMLElement = this.imgUpload.nativeElement;
        el.click();
    }
    
    onChooseImage(e) {
      var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
      if(!file) {return}
      var pattern = /image-*/;
      const formData: FormData = new FormData();
      if (!file.type.match(pattern)) {
        alert('invalid format');
        return;
      }
      formData.append('image', file, file.name)
      this.persistImageData(formData);
      e.srcElement.value = '';
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
    
    persistImageData(data) {
      this.isUploadingImage = true
      const subscription = this.userService.uploadImage(data)
      this.subscription = subscription
      .subscribe(
          (res)=>{
            this.isUploadingImage = false;
            this.newIdeaLogo = res.body;
        },
        (error)=>{
          this.isUploadingImage = false;
          let notification = errorMessage.ConnectionError(error)
          this.openSnackBar(notification, 'snack-error')
    
        });
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
  

    persistIdea(data) {
      
      const subscription = this.userService.idea(data)
      this.subscription = subscription
      .subscribe(
          (res)=>{ 
          let notification = res.body
          if(res.code==200) {
          this.replaceNull('idea', res.ideas);
          this.pendingIdea = true;
          this.openSnackBar(notification, 'snack-success');
          } else {
            this.hasError = true;
            this.isConnecting = false;
            this.openSnackBar(notification, 'snack-error');
          }
        },
        (error)=>{
          this.hasError = true
          this.isConnecting = false
          let notification = errorMessage.ConnectionError(error)
          this.openSnackBar(notification, 'snack-error')
    
        });
    }

    updateIdea(data) {
      const subscription = this.userService.updateIdea(data)
      this.subscription = subscription
      .subscribe(
          (res)=>{ 
          let notification = res.body
          if(res.code==200) {
          this.openSnackBar(notification, 'snack-success');
          this.updateLocalIdea(data)
          } else {
            this.hasError = true;
            this.isConnecting = false;
            this.openSnackBar(notification, 'snack-error');
          }
        },
        (error)=>{
          this.hasError = true
          this.isConnecting = false
          let notification = errorMessage.ConnectionError(error)
          this.openSnackBar(notification, 'snack-error')
    
        });
    }

    updateLocalIdea(data:object) {
      let idea = this.ideas.find(x=> {
        return x.id == data['id']
      })

      if(!idea){return}
      idea['title'] = data['title'];
      idea['industry'] = data['industry'];
      idea['url'] = data['url'];
      idea['summary'] = data['summary'];
      idea['attachment'] = data['attachment'];
      idea['logo'] = data['logo'];
      this.toNewIdea = false
    }

    persistForum(data) {
      
      const subscription = this.userService.forum(data)
      this.subscription = subscription
      .subscribe(
          (res)=>{ 
          let notification = res.body
          if(res.code==200) {
          this.replaceNull('forum', res.forums);
          this.pendingForum = true;
          this.openSnackBar(notification, 'snack-success');
          } else {
            this.hasError = true;
            this.isConnecting = false;
            this.openSnackBar(notification, 'snack-error');
          }
        },
        (error)=>{
          this.hasError = true
          this.isConnecting = false
          let notification = errorMessage.ConnectionError(error)
          this.openSnackBar(notification, 'snack-error')
    
        });
    }

    persistForumMessage(data) {
  
      const subscription = this.userService.forumMessage(data)
      this.subscription = subscription
      .subscribe(
          (res)=>{ 
          let notification = res.body
          if(res.code==200) {
          this.replaceNull('conversation', res.chats);
          } else {
            this.hasError = true;
            this.isConnecting = false;
            this.openSnackBar(notification, 'snack-error');
          }
        },
        (error)=>{
          this.hasError = true
          this.isConnecting = false
          let notification = errorMessage.ConnectionError(error)
          this.openSnackBar(notification, 'snack-error')
    
        });
    }

    persistChatMessage(data) {
      
      const subscription = this.userService.chatMessage(data)
      this.subscription = subscription
      .subscribe(
          (res)=>{ 
          let notification = res.body
          if(res.code==200) {
          this.replaceNull('conversation', res.chats);
          } else {
            this.hasError = true;
            this.isConnecting = false;
            this.openSnackBar(notification, 'snack-error');
          }
        },
        (error)=>{
          this.hasError = true
          this.isConnecting = false
          let notification = errorMessage.ConnectionError(error)
          this.openSnackBar(notification, 'snack-error')
    
        });
    }

    hasPendingIdea() {
      const subscription = this.userService.hasPendingIdea()
      this.subscription = subscription
      .subscribe(
          (res)=>{ 
          if(res.code==200) {
            this.pendingIdea = res.body
          } else {
            this.hasError = true
            this.isConnecting = false
          }
        },
        (error)=>{
          this.hasError = true
          this.isConnecting = false
          let notification = errorMessage.ConnectionError(error)
          this.openSnackBar(notification, 'snack-error')
    
        });
    }

    fetchIdeas() {
      const subscription = this.userService.userIdeas()
      this.subscription = subscription
      .subscribe(
          (res)=>{
          if(res.code==200) {
            if(res.ideas) {   
            this.ideaDatas = res.ideas;
            } else {
              this.ideaDatas = [];
            }
            if(this.ideaDatas.length==0) {return}
            this.manipulateDatas('idea', this.ideaDatas);
          } else {
            this.hasError = true
            this.isConnecting = false
          }
        },
        (error)=>{
          this.hasError = true
          this.isConnecting = false
          let notification = errorMessage.ConnectionError(error)
          this.openSnackBar(notification, 'snack-error')
    
        });
    }

    fetchForums() {
      const subscription = this.userService.userForums()
      this.subscription = subscription
      .subscribe(
          (res)=>{ 
          if(res.code==200) {
            if(res.forums) {   
            this.forumDatas = res.forums;
            } else {
              this.forumDatas = [];
            }
            if(this.forumDatas.length==0) {return}
            this.manipulateDatas('forum', this.forumDatas);
            this.prepareForumPush(this.forumDatas)
          } else {
            this.hasError = true;
            this.isConnecting = false;
          }
        },
        (error)=>{
          this.hasError = true
          this.isConnecting = false
          let notification = errorMessage.ConnectionError(error)
          this.openSnackBar(notification, 'snack-error')
    
        });
    }


    prepareForumPush(datas: object[]) {
      datas.forEach(x=>{
        x['listening'] = false;
      })
    }


    fetchChats() {
      const subscription = this.userService.userChats()
      this.subscription = subscription
      .subscribe(
          (res)=>{
          if(res.code==200) {
            if(res.chats) {   
            this.datas = res.chats;
            } else {
              this.datas = [];
            }
            this.manipulateDatas('chat', this.datas);
          } else {
            this.hasError = true;
            this.isConnecting = false;
          }
        },
        (error)=>{
          this.hasError = true
          this.isConnecting = false
          let notification = errorMessage.ConnectionError(error)
          this.openSnackBar(notification, 'snack-error')
    
        });
    }

    fetchAllMessages(type:string, id:number){
      this.openChat(type, id);
      if(type=='forum') {
        let forum = this.forumDatas.find(x=>{
          return x['sender']['id'] ==id
        });

        if(!forum) {return}

        if(forum['fetched']) {
          return
        } else {
          forum['fetched'] = true
        }
        this.fetchForumMessages(id)
      }

      if(type=='chat') {
        let chat = this.datas.find(x=>{
          return x['sender']['id'] ==id
        });
        if(!chat){return}

        if(chat['fetched']) {
          return
        } else {
          chat['fetched'] = true
        }
        this.fetchChatMessages(id)
      }
    }

    fetchForumMessages(id: number) {
      const subscription = this.userService.forumMessages(id)
      this.subscription = subscription
      .subscribe(
          (res)=>{ 
          if(res.code==200) {
            if(res.conversations) {   
              this.pushAllMessages('forum', id, res.conversations)
            } else {

            }
          } else {
            this.hasError = true;
            this.isConnecting = false;
          }
        },
        (error)=>{
          this.hasError = true
          this.isConnecting = false
          let notification = errorMessage.ConnectionError(error)
          this.openSnackBar(notification, 'snack-error')
    
        });
    }

    fetchChatMessages(id: number) {
      const subscription = this.userService.chatMessages(id)
      this.subscription = subscription
      .subscribe(
          (res)=>{ 
          if(res.code==200) {
            if(res.conversations) {   
              this.pushAllMessages('chat', id, res.conversations)
            } else {

            }
          } else {
            this.hasError = true;
            this.isConnecting = false;
          }
        },
        (error)=>{
          this.hasError = true
          this.isConnecting = false
          let notification = errorMessage.ConnectionError(error)
          this.openSnackBar(notification, 'snack-error')
    
        });
    }

    pushAllMessages(type:string, id, data: object[]) {
      
      let dataStore = []
      if(type=='forum') {
        dataStore= this.forumDatas
      } else if(type=='chat') {
        dataStore = this.datas
      }

      let found = dataStore.find(x=> {
        return x.sender.id == id
      });

      if(!found) {
        return
      }
      found['conversation'] = data
      this.openChat(type,id)
    }

    replaceNull(type:string, data: object) {
      let replace = [];
      let found = {}
      if(type=='idea') {
        replace = this.ideaDatas
        found = replace.find(x=>{
          return x.title == data['title'] && x.id == null
        });

        if(!found) {
          return
        }
        
        found['id'] = data['id']

      }

      if(type=='forum') {
        
        replace = this.forumDatas
        found = replace.find(x=>{
          return x.sender.name == data['topic'] && x.sender.id == null
        });

        if(!found) {
          return
        }

        found['sender']['id'] = data['id']
        this.replaceNullMessage(data['message_id'], data['id'], data['message'], found )

      }

      if(type=='conversation') {
        let sender_id = 0
        if(data['type']=='forum') {   
         replace = this.forumDatas
         
        found = replace.find(x=>{
          return x.sender.id == data['forum_id']
        });
        sender_id = data['forum_id']
        }

        if(data['type']=='chat') {   
          replace = this.datas
          
         found = replace.find(x=>{
           return x.sender.id == data['recipient_id']
         });
         sender_id = data['recipient_id']
         }

        if(!found) {
          return
        }
        this.replaceNullMessage(data['id'], sender_id, data['message'], found )

      }

    }

    replaceNullMessage(id: number, sender_id, message: string, data: object){
      let found = data['conversation'].find(x=>{
          return x.message == message && x.id== null;
      });

      if(!found) {
        return
      }

      found['id'] = id;
      found['recipient_id'] = sender_id;
      found['sender_id'] = found['sender']['id']
      found['status'] = 'delivered';
    }


    fetchIndustry() {
      const subscription = this.userService.industries()
      this.subscription = subscription
      .subscribe(
          (res)=>{
            if(res.code != 200 || !res.body || res.body.length==0) {
              return
            }
            res.body.forEach(element => {
              this.industries.push(element)
            });
        },
        (error)=>{
          this.isConnecting = false
          this.hasError = true;
        });
    }

    newTab(link:string) {
      window.open(
        link,
        '_blank' // <- This is what makes it open in a new window or tab.
      );
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

    preventBackButton() {
      history.pushState(null, null, location.href);
      this.locationStrategy.onPopState(() => {
        history.pushState(null, null, location.href);
      })
    }
    
    appNews(news: string){
      this.openSnackBar(news, 'snack-news')
    }

    onDeleteItem(type:string, id:number) {
      let msg = "Are you sure you want to delete this Idea?"
      this.openDialog(type, id, msg)
    }

    onEdit(type:string, id:number) {
     let idea = this.ideas.find(x=> {
        return x.id == id
      })

      if(!idea){return}
      this.editableIdea = id
      this.fillIdeaForm(idea)
    }

    fillIdeaForm(idea: object) {
      this.firstIdeaGroup.get('title').setValue(idea['title']);
      this.firstIdeaGroup.get('industry').setValue(idea['industry']);
      this.secondIdeaGroup.get('summary').setValue(idea['summary']);
      this.thirdIdeaGroup.get('website').setValue(idea['website']);
      this.newIdeaPlan = idea['attachment'];
      this.newIdeaLogo = idea['logo'];
      this.gotoNewIdea('update')
    }

    openDialog(type: string, id:number, msg: string): void {
      const dialogRef = this.dialog.open(SharedDialogComponent, {
        width: '250px',
        data: {id:id, message:msg}
      });
    
      dialogRef.afterClosed().subscribe(result => {
        if(!result){
          return
        }
        this.deleteItem(type, id)
      });
    }

    deleteItem(type:string, id:number) {
      if(type=='idea') {
       let idea = this.ideaDatas.find(x=> {
          return x['id'] == id
        });

        if(!idea) {return}

        let index = this.ideaDatas.indexOf(idea)
        this.ideaDatas.splice(index, 1)
      }

      this.persistDelete(type, id)
    }

    persistDelete(type:string, id: number) {
      let subscription = this.userService.deleteIdea(id)
      if(type=='idea') {
        subscription = this.userService.deleteIdea(id)
      }
      this.subscription = subscription
      .subscribe(
          (res)=>{ 
          if(res.code==200) {
            this.pendingIdea = false
          } else {
            this.hasError = true;
            this.isConnecting = false;
          }
        },
        (error)=>{
          this.hasError = true
          this.isConnecting = false
          let notification = errorMessage.ConnectionError(error)
          this.openSnackBar(notification, 'snack-error')
    
        });
    }

    ngOnDestroy() {
      if(!this.subscription) {return}
      if(!this.mobileQuery) {return}
      this.subscription.unsubscribe();
      this.mobileQuery.removeListener(this._mobileQueryListener)
    }
  


}