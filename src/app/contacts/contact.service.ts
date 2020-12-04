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

  sortAndSend() {
    this.contacts.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  getContacts(){
    // return this.contacts
    //   .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
    //   .slice();
    this.http.get<{message: string, contacts:Contact[]}>('http://localhost:3000/contacts').subscribe(
      // success method
      (response) => {
          this.contacts = response.contacts;
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

  // Deprecated see below
  // getContact(id: string): Contact {
  //   for (const contact of this.contacts) {
  //     if (contact.id === id) {
  //       return contact;
  //     }
  //   }
  //   return null;
  // }

  getContact(id: string){
    // return this.contacts
    //   .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
    //   .slice();
    // let recievedContact: Contact;
    // console.log('before get recievedContact');
    // console.log(recievedContact);

    return this.http.get<{message: string, contact:Contact}>('http://localhost:3000/contacts/' + id);
    // .subscribe(
    //   // success method
    //   (response) => {
    //     console.log(response);
    //       return response.contact;
    //       // recievedContact = response.contact;
    //       // console.log(recievedContact);
    //       // return recievedContact;
    //   },
    //   // error method
    //   (error: any) => {
    //       // print the error to the console
    //       console.log(error);
    //   }
    // );
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

  // Deprecated see new addContact function below
  // addContact(newContact: Contact) {
  //   if (newContact == undefined ||newContact == null) {
  //       return;
  //   }

  //   this.maxContactId++;
  //   newContact.id = this.maxContactId.toString();
  //   this.contacts.push(newContact);
  //   // let contactsListClone = this.contacts.slice();
  //   // this.contactListChangedEvent.next(contactsListClone);
  //   this.storeContacts();
  // }

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    // make sure id of the new Contact is empty
    contact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new contact to contacts
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        }
      );
  }

  // Deprecated see new function below
  // updateContact(originalContact: Contact, newContact: Contact) {
  //   if (originalContact == undefined || 
  //       newContact == undefined || 
  //       originalContact == null || 
  //       newContact == null) {
  //       return;
  //   }

  //   let pos = this.contacts.indexOf(originalContact);
  //   if (pos < 0) {
  //       return;
  //   }

  //   newContact.id = originalContact.id;
  //   this.contacts[pos] = newContact;
  //   // let contactsListClone = this.contacts.slice();
  //   // this.contactListChangedEvent.next(contactsListClone);
  //   this.storeContacts();
  // }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Contact to the id of the old Contact
    newContact.id = originalContact.id;
    // newContact._id = originalContact._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.contacts[pos] = newContact;
          this.sortAndSend();
        }
      );
  }

  // Deprecated see new function below
  // deleteContact(contact: Contact) {
  //   if (!contact) {
  //     return;
  //   }
  //   const pos = this.contacts.indexOf(contact);
  //   if (pos < 0) {
  //     return;
  //   }
  //   this.contacts.splice(pos, 1);
  //   // this.contactListChangedEvent.next(this.contacts.slice());
  //   this.storeContacts();
  // }

  deleteContact(contact: Contact) {

    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === contact.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response: Response) => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
      );
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
