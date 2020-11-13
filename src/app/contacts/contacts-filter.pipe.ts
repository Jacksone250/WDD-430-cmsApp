import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter'
})
export class ContactsFilterPipe implements PipeTransform {

  // the For-in loop doesn't seem to work the way I expected it too.
  // transform(contacts: Contact[], term) {
  //   let filteredContacts: Contact[] = [];

  //   for (let contact in contacts){
  //     if(contact) {
  //       // Add the contact to the new filtered array
  //       // filteredContacts.push(contact);
  //       console.log(contact);
  //     }
  //   }

  //   if(filteredContacts.length === 0) {
  //       // RETURN the original contacts list
  //       return contacts;
  //   }

  //   return filteredContacts;
  // }
  // Below is code that taken out of the for in loopo because the contact in the loop was expected to be a string.
  // .name.includes(term)

  
  transform(contacts: Contact[], term) { 
    let filteredContacts: Contact[] =[];  
    if (term && term.length > 0) {
      filteredContacts = contacts.filter(
          (contact:Contact) => contact.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    if (filteredContacts.length < 1){
      return contacts;
    }
    return filteredContacts;
  }


}

