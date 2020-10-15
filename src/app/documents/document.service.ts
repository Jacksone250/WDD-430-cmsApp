import { EventEmitter, Injectable, OnInit } from '@angular/core';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = MOCKDOCUMENTS;
  documentSelectedEvent = new EventEmitter<Document>();

  constructor() { }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string):Document {
    this.documents.forEach(document => {
      if (document.id = id){
        return document;
      }
    })
    return null;
  }
}
