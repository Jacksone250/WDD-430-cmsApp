import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService{
  private documents: Document[] = [];
  private maxDocumentId: number;
  documentListChangedEvent = new Subject<Document[]>();
  

  constructor(private http: HttpClient) {
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    // return this.documents.slice();
    this.http.get<Document[]>('https://cmsapp-aefa9.firebaseio.com/documents.json').subscribe(
      // success method
      (documents: Document[] ) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          // sort the list of documents
          this.documents.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
          // emit the next document list change event
          this.documentListChangedEvent.next(this.documents.slice());
      },
      // error method
      (error: any) => {
          // print the error to the console
          console.log(error);
      }
    );
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
    // let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();

  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (originalDocument == undefined || 
        newDocument == undefined || 
        originalDocument == null || 
        newDocument == null) {
        return;
    }

    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
        return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    // let documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();

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
    // this.documentListChangedEvent.next(this.documents.slice());
    this.storeDocuments();
  }

  storeDocuments() {
    this.http
      .put('https://cmsapp-aefa9.firebaseio.com/documents.json', 
      JSON.stringify(this.documents),
      {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      })
      .subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }
  

}
