import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  private maxContactId: number;
  contactListChangedEvent = new Subject<Contact[]>();

  constructor(private http: HttpClient) {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
   }

  getContacts(){
    // return this.contacts
    //   .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
    //   .slice();
    this.http.get<Contact[]>('https://cmsapp-aefa9.firebaseio.com/contacts.json').subscribe(
      // success method
      (contacts: Contact[] ) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          // sort the list of contacts
          this.contacts.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
          // emit the next contact list change event
          this.contactListChangedEvent.next(this.contacts.slice());
      },
      // error method
      (error: any) => {
          // print the error to the console
          console.log(error);
      }
    );
  }

  getContact(id: string): Contact {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId = 0;

    for( let contact of this.contacts) {
        let currentId = +contact.id;
        if (currentId > maxId) {
            maxId = currentId;
        }
    }

    return maxId;
  }

  addContact(newContact: Contact) {
    if (newContact == undefined ||newContact == null) {
        return;
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    // let contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (originalContact == undefined || 
        newContact == undefined || 
        originalContact == null || 
        newContact == null) {
        return;
    }

    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
        return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    // let contactsListClone = this.contacts.slice();
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }
    this.contacts.splice(pos, 1);
    // this.contactListChangedEvent.next(this.contacts.slice());
    this.storeContacts();
  }

  storeContacts() {
    this.http
      .put('https://cmsapp-aefa9.firebaseio.com/contacts.json', 
      JSON.stringify(this.contacts),
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      })
      .subscribe(() => {
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }

  
}
