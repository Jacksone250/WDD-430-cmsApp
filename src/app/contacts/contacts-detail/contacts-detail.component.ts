import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contacts-detail',
  templateUrl: './contacts-detail.component.html',
  styleUrls: ['./contacts-detail.component.css']
})
export class ContactsDetailComponent implements OnInit {
  contact: Contact = new Contact('3', 'Tim Thayne', 'thaynet@byui.edu', '208-496-3777 ', 'https://web.byui.edu/Directory/Employee/thaynet.jpg', null);

  constructor() { }

  ngOnInit(): void {
  }

}
