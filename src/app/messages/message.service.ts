import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[];
  maxMessageId: number;
  messageChangeEvent = new EventEmitter<Message[]>();

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES;
   }

   getMessages() {
    // return this.messages.slice();
    this.http.get<Message[]>('https://cmsapp-aefa9.firebaseio.com/messages.json').subscribe(
      // success method
      (messages: Message[] ) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();
          // sort the list of messages
          // this.messages.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
          // emit the next message list change event
          this.messageChangeEvent.next(this.messages.slice());
      },
      // error method
      (error: any) => {
          // print the error to the console
          console.log(error);
      }
    );
  }

  getMessage(id: string): Message {
    this.messages.forEach(message => {
      if (message.id = id){
        return message;
      }
    })
    return null;
  }

  getMaxId(): number {
    let maxId = 0;

    for( let message of this.messages) {
        let currentId = +message.id;
        if (currentId > maxId) {
            maxId = currentId;
        }
    }

    return maxId;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    // this.messageChangeEvent.emit(this.messages.slice());
    this.storeMessages();
  }

  storeMessages() {
    this.http
      .put('https://cmsapp-aefa9.firebaseio.com/messages.json', 
      JSON.stringify(this.messages),
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      })
      .subscribe(() => {
        this.messageChangeEvent.next(this.messages.slice());
      });
  }
}
