import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor(private documentService: DocumentService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(
      (params: Params) => {
         let id = params['id']
         if (id === undefined || id === null) {
            this.editMode = false;
            return;
         }

         this.originalDocument = this.documentService.getDocument(id);
    
         if (this.originalDocument === undefined || this.originalDocument === null) {
            return;
         }

         this.editMode = true;
         this.document = JSON.parse(JSON.stringify(this.originalDocument));
    }); 
  }

  onSubmit(form: FormGroup) {
    let value = form.value // get values from form’s fields
    let newDocument = new Document('', value.id, value.name, value.description, value.url, value.children);
    if (this.editMode === true) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }

    this.onCancel(); 
  }

  onCancel() {
    this.router.navigate(['./documents']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
