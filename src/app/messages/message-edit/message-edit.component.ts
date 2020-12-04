import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';

import { ContactService } from 'src/app/contacts/contact.service';
import { Contact } from '../../contacts/contact.model';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subject: ElementRef;
  @ViewChild('msgText') msgText: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();
  currnetSender: Contact;

  constructor(
    private messageService: MessageService,
    private contactService: ContactService) { }

  ngOnInit(): void {
    this.contactService.getContact('101').subscribe(
      response => {
        this.currnetSender = response.contact;
        console.log(this.currnetSender);
      }
    )
  }

  onSendMessage() {
    const subjectValue = this.subject.nativeElement.value;
    const msgTextValue = this.msgText.nativeElement.value;

    const message = new Message(
      '',
      '1',
      subjectValue,
      msgTextValue,
      this.currnetSender
    );

    this.messageService.addMessage(message);

    this.onClear();
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }

}
