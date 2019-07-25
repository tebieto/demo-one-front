import { Component, OnInit, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


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

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  toForum = false;
  toNewForum = false;
  toIdea= false;
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
  conversations = [];
  forums= []
  ideas= []
  pinnedConversations = [];
  typedMessage = ''
  parentMessage = {}
  newForumStatus = true
 




  

  
  authUser = {
    id: 1,
    name: "Terry Ebieto",
    avatar: "/assets/images/cards/5.png"
  }


  fakeObject = {
          id: 30,
          sender_id: 5,
          recipient_id: 1,
          sender: {
            id: 5,
            name: "Jennifer Daniel",
            avatar: "/assets/images/cards/4.png"
          },
          message: "Jennifer Daniel: Have you followed us on IG?",
          created_at: "2019-07-18 23:00:07",
          status: 'delivered',
          unread: true,
          starred: false,
          parent: 0,
          type: 'chat'
        }


      fakeObject1 = {
          id: 31,
          sender_id: 5,
          recipient_id: 1,
          sender: {
            id: 5,
            name: "Jennifer Daniel",
            avatar: "/assets/images/cards/4.png"
          },
          message: "Jennifer Daniel: Have you followed us on IG?",
          created_at: "2019-07-18 23:00:07",
          status: 'delivered',
          unread: true,
          starred: false,
          parent: 0,
          type: 'chat'
        }

  forumDatas = [
    {
      sender: {
        id: 4,
        name: "Forum 1",
        avatar: "/assets/images/cards/1.png"
      },
      recipient: {
        id: 1,
        name: "Terry Ebieto",
        avatar: "/assets/images/cards/5.png"
      },
      owner: 5,
      conversation: [
        {
          id: 1,
          sender_id: 4,
          recipient_id: 1,
          sender: {
            id: 4,
            name: "Ufo South",
            avatar: "/assets/images/cards/3.png"
          },
          message: "Ufo South: Hey bruh",
          created_at: "2019-07-7 14:27:07",
          status: "delivered",
          unread: false,
          starred: false,
          parent: 0,
          type: 'forum'
        }, 
        {
          id: 2,
          sender_id: 4,
          recipient_id: 1,
          sender: {
            id: 2,
            name: "Endurance Apina",
            avatar: "/assets/images/cards/1.png"
          },
          message: "Endurance Apina: Hw farHw farHw farHw farHw farHw farHw farHw farHw farHw farHw farHw far",
          created_at: "2019-07-12 14:26:07",
          status: 'sent',
          unread: false,
          starred: false,
          parent: 0,
          type: 'forum'
        }
    ],
      active: false,
      pinned: false,
      type: 'forum'
    },
    {
      sender: {
        id: 3,
        name: "Forum Two",
        avatar: "/assets/images/cards/3.png"
      },
      recipient: {
        id: 1,
        name: "Terry Ebieto",
        avatar: "/assets/images/cards/5.png"
      },
      owner: 5,
      conversation: [ 
        {
          id: 4,
          sender_id: 3,
          recipient_id: 1,
          sender: {
            id: 4,
            name: "Ufo South",
            avatar: "/assets/images/cards/3.png"
          },
          message: "Ufo South: Hey bruh",
          created_at: "2019-07-7 14:27:07",
          status: "delivered",
          unread: false,
          starred: false,
          parent: 0,
          type: 'forum'
        },
        {
          id: 5,
          sender_id: 3,
          recipient_id: 1,
          sender: {
            id: 2,
            name: "Endurance Apina",
            avatar: "/assets/images/cards/1.png"
          },
          message: "Endurance Apina: Hw farHw farHw farHw farHw farHw farHw farHw farHw farHw farHw farHw far",
          created_at: "2019-07-12 14:26:07",
          status: 'sent',
          unread: false,
          starred: false,
          parent: 0,
          type: 'forum'
        }
      ],
      active: false,
      pinned: true,
      type: 'forum'
    },
    {
      sender: {
        id: 10,
        name: "Forum 3",
        avatar: "/assets/images/cards/4.png"
      },
      recipient: {
        id: 1,
        name: "Terry Ebieto",
        avatar: "/assets/images/cards/5.png"
      },
      owner: 5,
      conversation: [ 
        {
          id: 12,
          sender_id: 10,
          recipient_id: 1,
          sender: {
            id: 5,
            name: "Jennifer Daniel",
            avatar: "/assets/images/cards/4.png"
          },
          message: "Jennifer Daniel: Please follow GPI on IG Please follow GPI on IG Please follow GPI on IG",
          created_at: "2019-01-02 14:27:07",
          status: 'delivered',
          unread: false,
          starred: false,
          parent: 0,
          type: 'forum'
        },
        {
          id: 21,
          sender_id: 10,
          recipient_id: 1,
          sender: {
            id: 5,
            name: "Jennifer Daniel",
            avatar: "/assets/images/cards/4.png"
          },
          message: "Jennifer Daniel: Hi",
          created_at: "2019-07-12 18:06:07",
          status: 'delivered',
          unread: true,
          starred: false,
          parent: 0,
          type: 'forum'
        }
      ],
      active: false,
      pinned: false,
      type: 'forum'
    }

  ];

  datas = [
    {
      sender: {
        id: 2,
        name: "Endurance Apina",
        avatar: "/assets/images/cards/1.png"
      },
      recipient: {
        id: 1,
        name: "Terry Ebieto",
        avatar: "/assets/images/cards/5.png"
      },
      owner: 2,
      conversation: [ 
        {
          id: 31,
          sender_id: 1,
          recipient_id: 2,
          sender: {
            id: 1,
            name: "Terry Ebieto",
            avatar: "/assets/images/cards/5.png"
          },
          message: "Terry Ebieto: How far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far How far EndyHow far Endy far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far Endy",
          created_at: "2019-07-6 14:27:07",
          status: 'delivered',
          unread: false,
          starred: false,
          parent: 0,
          type: 'chat'
        },

        {
          id: 32,
          sender_id: 2,
          recipient_id: 1,
          sender: {
            id: 2,
            name: "Endurance Apina",
            avatar: "/assets/images/cards/1.png"
          },
          message: "Endurance Apina: Hw farHw farHw farHw farHw farHw farHw farHw farHw farHw farHw farHw far",
          created_at: "2019-07-12 14:26:07",
          status: 'sent',
          unread: false,
          starred: false,
          parent: 0,
          type: 'chat'
        },
        {
          id: 3,
          sender_id: 2,
          recipient_id: 1,
          sender: {
            id: 2,
            name: "Endurance Apina",
            avatar: "/assets/images/cards/1.png"
          },
          message: "Endurance Apina: Hw far",
          created_at: "2019-07-12 14:27:07",
          status: 'pending',
          unread: false,
          starred: false,
          parent: 0,
          type: 'chat'
        },
        {
          id: 1,
          sender_id: 1,
          recipient_id: 2,
          sender: {
            id: 1,
            name: "Terry Ebieto",
            avatar: "/assets/images/cards/5.png"
          },
          message: "Terry Ebieto: How far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far How far EndyHow far Endy far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far Endy",
          created_at: "2019-07-12 14:27:07",
          status: 'delivered',
          unread: false,
          starred: false,
          parent: 0,
          type: 'chat'
        },

        {
          id: 2,
          sender_id: 1,
          recipient_id: 2,
          sender: {
            id: 1,
            name: "Terry Ebieto",
            avatar: "/assets/images/cards/5.png"
          },
          message: "Terry Ebieto: How far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far How far EndyHow far Endy far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far Endy",
          created_at: "2019-07-12 14:27:07",
          status: 'delivered',
          unread: false,
          starred: false,
          parent: 0,
          type: 'chat'
        },
    ],
      active: false,
      pinned: false,
      type: 'chat'
    },
    {
      sender: {
        id: 3,
        name: "Modupe Bobade",
        avatar: "/assets/images/cards/2.png"
      },
      recipient: {
        id: 1,
        name: "Terry Ebieto",
        avatar: "/assets/images/cards/5.png"
      },
      owner: 3,
      conversation: [ 
        {
          id: 3,
          sender_id: 1,
          recipient_id: 3,
          sender: {
            id: 1,
            name: "Terry Ebieto",
            avatar: "/assets/images/cards/5.png"
          },
          message: "Terry Ebieto: How are you Dupsy How are you Dupsy How are you Dupsy",
          created_at: "2019-07-11 14:27:07",
          status: "delivered",
          unread: false,
          starred: false,
          parent: 0,
          type: 'chat'
        }
      ],
      active: false,
      pinned: false,
      type: 'chat'
    },
    {
      sender: {
        id: 5,
        name: "Jennifer Daniel",
        avatar: "/assets/images/cards/4.png"
      },
      recipient: {
        id: 1,
        name: "Terry Ebieto",
        avatar: "/assets/images/cards/5.png"
      },
      owner: 5,
      conversation: [ 
        {
          id: 5,
          sender_id: 5,
          recipient_id: 1,
          sender: {
            id: 5,
            name: "Jennifer Daniel",
            avatar: "/assets/images/cards/4.png"
          },
          message: "Jennifer Daniel: Please follow GPI on IG Please follow GPI on IG Please follow GPI on IG",
          created_at: "2019-01-02 14:27:07",
          status: 'delivered',
          unread: false,
          starred: false,
          parent: 0,
          type: 'chat'
        },
        {
          id: 7,
          sender_id: 1,
          recipient_id: 5,
          sender: {
            id: 1,
            name: "Terry Ebieto",
            avatar: "/assets/images/cards/5.png"
          },
          message: "Terry Ebieto: How far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far How far EndyHow far Endy far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far Endy",
          created_at: "2019-02-03 15:01:07",
          status: 'delivered',
          unread: false,
          starred: false,
          parent: 0,
          type: 'chat'
        },
        {
          id: 10,
          sender_id: 1,
          recipient_id: 5,
          sender: {
            id: 1,
            name: "Terry Ebieto",
            avatar: "/assets/images/cards/5.png"
          },
          message: "Terry Ebieto: How far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far How far EndyHow far Endy far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far Endy",
          created_at: "2019-02-03 15:01:07",
          status: 'delivered',
          unread: false,
          starred: false,
          parent: 0,
          type: 'chat'
        },
        {
          id: 20,
          sender_id: 1,
          recipient_id: 5,
          sender: {
            id: 1,
            name: "Terry Ebieto",
            avatar: "/assets/images/cards/5.png"
          },
          message: "Terry Ebieto: How far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far How far EndyHow far Endy far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far EndyHow far Endy",
          created_at: "2019-02-03 15:01:07",
          status: 'delivered',
          unread: false,
          starred: false,
          parent: 0,
          type: 'chat'
        },

        {
          id: 21,
          sender_id: 5,
          recipient_id: 1,
          sender: {
            id: 5,
            name: "Jennifer Daniel",
            avatar: "/assets/images/cards/4.png"
          },
          message: "Jennifer Daniel: Hi",
          created_at: "2019-07-12 18:06:07",
          status: 'delivered',
          unread: true,
          starred: false,
          parent: 7,
          type: 'chat'
        }
      ],
      active: false,
      pinned: false,
      type: 'chat'
    }

  ];
  




  constructor(private _formBuilder: FormBuilder) { }


        ngOnInit() {
          this.manipulateDatas('chat', this.datas);
          this.manipulateDatas('forum', this.forumDatas);
          this.populateSource('chat');

          this.initFakeData();
          this.activateFormGroups();

        }


        initFakeData(){

          setTimeout(()=>{
            this.pushToConversation(this.fakeObject)
          },1000)

          setTimeout(()=>{
            this.pushToConversation(this.fakeObject1)
          },1500)


        }

        pushToConversation(data: object){

        let available = this.conversations.find(c=>{
            return (c.sender.id == data['sender_id'] && c.recipient.id==data['recipient_id'])
          });

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

          let UTCString = new Date(time+'Z')

          return this.fetchTime(UTCString);
        }



        getGroupTime(time: string): any{

          
          let now = new Date().getTime()
              let UTCString = new Date(time+'Z')
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
              let UTCString = new Date(time+'Z')
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
        let months = [1,2,3,4,5,6,7,8,9,10,11,12]
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





        replaceMatch(name:string){
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
            this.typedMessage = '';
            this.parentMessage = {};
            this.desparity =  0;
            this.scrollHeight = 0;
            this.scrollTop = 0;
            let activeChat = [];
            let activateChat = [];

            if(type=="chat") {
              this.xActive = this.active
            } else if(type=="forum") {
              this.xActive = this.activeForum
            } else {
              return
            }
            

          // deactivate active chat

          // Active Deactivation 
          
          if(this.activeConversation) {   
            this.activeConversation['active'] = false;
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

                } else if (type=='forum') {

                   activeChat  = this.forums.find((x)=> {
                    return x.sender.id == this.activeForum
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


          }


          if(activateChat) {

                activateChat['active'] = true;
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
              },1)

              // Remove unread div after timeout
              setTimeout(()=>{
                
                if(this.showUnread==true) {
                  this.showUnread=false;
                  }

              },10000)
            }
            


            return

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
          }
          

          if(!c) {return}

          c['pinned'] = true;

          if(type=='chat') {

            this.sortData(this.conversations)
            this.conversations = this.fixPinned(this.conversations)
            
          } else if(type=="forum") {

            this.sortData(this.forums)
            this.forums = this.fixPinned(this.forums)
            
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
          }

          if(!c) {return}

          c['pinned'] = false;

          if(type=='chat') {

            this.sortData(this.conversations)
            this.conversations = this.fixPinned(this.conversations)

          } else if(type=="forum") {

            this.sortData(this.forums)
            this.forums = this.fixPinned(this.forums)
            
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
          this.scrollHeight = this.scrollHeight - this.scrollOffset

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

        this.newToConversation(newMessage)
        this.typedMessage = '';
        this.parentMessage = {}

        setTimeout(()=>{  
        this.backToBottom();
        },1);
        
      }

      utcNow() {

        let now = new Date()
        let months = [1,2,3,4,5,6,7,8,9,10,11,12]
        let date = now.getUTCFullYear()+'-'+months[now.getUTCMonth()]+'-'+now.getUTCDate()+' '+ now.getUTCHours()+':'+now.getUTCMinutes()+':'+now.getUTCSeconds()
        return date;
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
        this.toNewForum = false;
        this.toForum = true;
        this.toIdea = false;
        this.populateSource('forum')
      }

      gotoIdea (){
        this.toForum = false;
        this.toIdea = true;
        this.populateSource('idea')
      }

      gotoConversation() {
        this.toForum = false;
        this.toIdea = false;
        this.populateSource('chat')
      }

      gotoNewForum() {
        this.toNewForum = true;
      }

      activateFormGroups() {

        this.firstFormGroup = this._formBuilder.group({
          topic: ['', [Validators.required, Validators.minLength(10)]]
        });
        this.secondFormGroup = this._formBuilder.group({
          message: ['', [Validators.required, Validators.minLength(20)]]
        });
      }

      getSliderChange(e) {
        this.newForumStatus=e['checked'];
      }

      postNewForum() {

        let  now = this.utcNow();

        let data = {
          'topic': this.firstFormGroup.controls['topic'].value,
          'message': this.secondFormGroup.controls['message'].value,
          'status': this.newForumStatus
        }

        let forumData = {
          sender: {
            id: null,
            name: data.topic,
            avatar: "/assets/images/cards/1.png"
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
          type: 'forum'
        }

        
        this.pushToData('forum', forumData)
        this.gotoForum();
        this.clearFormData();

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
        }

      }

      clearFormData() {
        this.firstFormGroup.get('topic').setValue('');
        this.secondFormGroup.get('message').setValue('');
        this.newForumStatus = true;
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
          
          this.startNewDirect(isValid)
      
        }
      }


      startNewDirect(data: object) {
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

        setTimeout(()=>{  
          this.openChat('chat', data['sender'].id)
          },1);

      }




}