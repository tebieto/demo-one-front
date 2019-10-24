import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UserService } from '../user/user.service';
import { Subscription } from 'rxjs';
import Pusher from 'pusher-js';
import { Config } from 'src/app/config';

@Component({
  selector: 'app-shared-notification',
  templateUrl: './shared-notification.component.html',
  styleUrls: ['./shared-notification.component.css']
})
export class SharedNotificationComponent implements OnChanges {

  @Input('id') id: number

  subscription: Subscription

  hasNotification = false
  allNotifications = []
  notNumber = 0
  hasError: boolean;

  constructor(
    private userService: UserService,
  ) { }

  ngOnChanges() {
    this.getAllNotifications()
    this.activateChannel(this.id, 'notification')
  }

  activateChannel(id:number, type: string) {
    let pusher = new Pusher(Config.pusher.key, {
      cluster: Config.pusher.cluster,
      forceTLS: true
    });
    let channel = pusher.subscribe(id+'');
    channel.bind(type, data => {
      if(type=='notification') {
      this.allNotifications.reverse().push(data)
      this.allNotifications.reverse()
      this.notNumber+=1
      this.hasNotification = true
      let url = '/mentor/home'
      this.userService.notifyMe(data, url)
      return
      }
    this.cleanPushedMessage(data);
    this.playChatSound()
    });
  }

  cleanPushedMessage(data: object) {

  }

  playChatSound() {
    let audio = new Audio();
    audio.src = "/assets/sound/ideahub_chat.mp3";
    audio.load();
    audio.play();
  }

  getAllNotifications() {
    const subscription = this.userService.allNotifications()
    this.subscription = subscription
    .subscribe(
        (res)=>{
        if(res.code==200) {
          if(res.body) {
            this.allNotifications = res.body.reverse()
            this.getUnreadNot(this.allNotifications)
          } else {  
          }
        } else {     
        }
      },
      (error)=>{
        this.hasError = true
  
      });
  }

  getUnreadNot(data:object[]) {
    if(data.length==0) {return}
    let unReadNot = []
    data.forEach(x=> {
      if(x['type']=='idea') {
        x['link'] = '/dashboard/idea'
      }else if(x['type']=='forum') {
        x['link'] = '/dashboard/forum'
      } else {
        x['link'] = ''
      }
      if (x['unread']==1) {
        x['unread'] = true;
        unReadNot.push(x)
      } else if (x['unread']==11) {
        x['unread']=false;
      }
    });
    if(unReadNot.length>0) {this.hasNotification=true}
    this.notNumber = unReadNot.length
  }

  onReadAllNotifications() {
    setTimeout(() => {
      this.readAllNotifications()
    }, 1000);
  }

  readAllNotifications() {
    if(this.hasNotification==false) {return}
    this.notNumber = 0
    this.hasNotification=false; 
    const subscription = this.userService.readAllNotifications()
    this.subscription = subscription
    .subscribe(
        (res)=>{
        if(res.code==200) {
          // Do anything
          if(res.body) {
           // Do anything
          } else {  
          }
        } else {     
        }
      },
      (error)=>{
        this.hasError = true
      });
  }

  ngOnDestroy() {
    if(!this.subscription){return}
    this.subscription.unsubscribe();
  }

}
