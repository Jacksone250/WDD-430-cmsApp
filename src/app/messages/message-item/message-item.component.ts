import { Component, OnInit, Input } from '@angular/core';
import { ContactService } from 'src/app/contacts/contact.service';
import { map } from 'rxjs/operators';

import { Message } from '../message.model';
import { Contact } from 'src/app/contacts/contact.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() message: Message;
  messageSender: string;

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    // let contact = this.contactService.getContact(this.message.sender);
    // this.messageSender = contact ? contact.contact.name : 'Contact not Found';
    // console.log('inside message item component');
    // console.log(contact);
    // if (!contact.name || contact.name === undefined){
    //   this.messageSender = this.message.sender;
    // }

    // let contact: Contact;
    // contact = this.contactService.getContact(this.message.sender).subscribe((response)=>{ return response.contact});

    console.log('this is the message');
    console.log(this.message);
    this.contactService.getContact(this.message.sender.id).subscribe((response)=>{
      this.messageSender = response.contact.name;
    });

    // this.messageSender = contact ? contact.name : "Contact Not Loaded";
    // console.log(contact);
  }

}




