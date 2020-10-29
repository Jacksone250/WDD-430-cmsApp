import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService{
  private documents: Document[];
  private maxDocumentId: number;
  documentListChangedEvent = new Subject<Document[]>();
  

  constructor() {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
   }

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

  getMaxId(): number {
    let maxId = 0;

    for( let document of this.documents) {
        let currentId = +document.id;
        if (currentId > maxId) {
            maxId = currentId;
        }
    }

    return maxId;
  }

  addDocument(newDocument: Document) {
    if (newDocument == undefined ||newDocument == null) {
        return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    let documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (originalDocument == undefined || 
        newDocument == undefined || 
        originalDocument == null || 
        newDocument == null) {
        return;
    }

    let pos = this.documents.indexOf(originalDocument)
    if (pos < 0) {
        return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    let documentsListClone = this.documents.slice()
    this.documentListChangedEvent.next(documentsListClone)
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
    this.documentListChangedEvent.next(this.documents.slice());
  }

}
