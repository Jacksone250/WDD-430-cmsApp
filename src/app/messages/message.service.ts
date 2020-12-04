import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

import { Message } from './message.model';
// import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[];
  maxMessageId: number;
  messageChangeEvent = new EventEmitter<Message[]>();

  constructor(private http: HttpClient) {
    // this.messages = MOCKMESSAGES;
  }

  sortAndSend() {
    // sorting not needed for messages
    // this.messages.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
    this.messageChangeEvent.next(this.messages.slice());
  }

   getMessages() {
    // return this.messages.slice();
    this.http.get<{message: string, messages: Message[]}>('http://localhost:3000/messages').subscribe(
      // success method
      (response) => {
          this.messages = response.messages;
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

  // Deprecated see new function below
  // addMessage(message: Message) {
  //   this.messages.push(message);
  //   // this.messageChangeEvent.emit(this.messages.slice());
  //   this.storeMessages();
  // }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    // make sure id of the new Message is empty
    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ response: string, newMessage: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          message._id = responseData.newMessage._id;
          message.id = responseData.newMessage.id;

          // add new message to messages
          this.messages.push(message);
          this.sortAndSend();
        }
      );
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
