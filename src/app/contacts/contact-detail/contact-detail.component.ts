import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  contact: Contact; 
  id: string; 
  
  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        // console.log(this.id);
        // this.contact = this.contactService.getContact(this.id).subscribe((response)=>{return response.contact});
        this.contactService.getContact(this.id).subscribe((response)=>{
          this.contact = response.contact;
        });
        // console.log(this.contactService.getContact(this.id));
      }
    )
  }

  onDelete() {
    this.contactService.deleteContact(this.contact);
    this.router.navigate(['contacts'], {relativeTo: this.route.root});
  }

}
