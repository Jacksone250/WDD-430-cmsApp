import { EventEmitter, Injectable, OnInit } from '@angular/core';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = MOCKDOCUMENTS;
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();

  constructor() { }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string):Document {
    let returnDoc: Document;
    this.documents.forEach(document => {
      if (document.id == id){
        returnDoc = document;
      }
    })
    return returnDoc;
  }

  
  deleteDocument(document: Document) {
    if (!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.documentChangedEvent.emit(this.documents.slice());
  }

}
