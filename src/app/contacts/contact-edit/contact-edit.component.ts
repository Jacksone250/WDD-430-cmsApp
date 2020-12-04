import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;

  constructor(private contactService: ContactService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        let id = params['id'];

        if (!id) {
          this.editMode = false;
          return;
        }

        // this.originalContact = this.contactService.getContact(id).pipe((response)=>{ return response.contact});
        // this.contactService.getContact(this.message.sender).subscribe((response)=>{ return response.contact});
        this.contactService.getContact(id).subscribe((response)=>{
          this.originalContact = response.contact;

          if (this.originalContact === undefined || this.originalContact === null) {
            console.log('exiting ng on init');
              return;
          }
  
          this.editMode = true;
          this.contact = JSON.parse(JSON.stringify(this.originalContact));
    
          if (this.contact.group.length > 0) {
            this.groupContacts = this.contact.group;
          }

        });

        // this.contactService.getContact(this.message.sender).subscribe((response)=>{
        //   this.messageSender = response.contact.name;
        // });

        // if (this.originalContact === undefined || this.originalContact === null) {
        //   console.log('exiting ng on init');
        //     return;
        // }

        // this.editMode = true;
        // this.contact = JSON.parse(JSON.stringify(this.originalContact));
  
        // if (this.contact.group.length > 0) {
        //   this.groupContacts = this.contact.group;
        // }
    }); 
  }

  // ngOnInit() {
  //   this.route.params.subscribe((params: Params) => {
  //     let id = params['id'];
  //     if (!id) {
  //       this.editMode = false;
  //       return;
  //     }
  //     this.originalContact = this.contactService.getContact(id);
  //     if (!this.originalContact) {
  //       return;
  //     }
  //     this.editMode = true;
  //     this.contact = JSON.parse(JSON.stringify(this.originalContact));
  //   });
  // }


  onSubmit(form: FormGroup) {
    let value = form.value // get values from form’s fields
    let newContact = new Contact( '',
                                  value.id, 
                                  value.name, 
                                  value.email, 
                                  value.phone, 
                                  value.imageUrl,
                                  value.group );
    if (this.editMode === true) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.onCancel();
  }

  onCancel() {
    this.router.navigate(['./contacts']);
  }

  onRemoveItem(i) {
    //stubbed since the 3rd party package has a breaking change
  }

}
