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

  sortAndSend() {
    this.documents.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
    this.documentListChangedEvent.next(this.documents.slice());
  }

  getDocuments() {
    // return this.documents.slice();
    this.http.get<{message: string, documents: Document[]}>('http://localhost:3000/documents').subscribe(
      // success method
      (response) => {
        console.log('Here is the Recieved Documents')
        console.log(response);
        console.log(response.documents);
          this.documents = response.documents;
          this.maxDocumentId = this.getMaxId();
          // // sort the list of documents
          // this.documents.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
          // // emit the next document list change event
          // this.documentListChangedEvent.next(this.documents.slice());

          this.sortAndSend();
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
    console.log(this.documents);
    for( let document of this.documents) {
        let currentId = +document.id;
        if (currentId > maxId) {
            maxId = currentId;
        }
    }

    return maxId;
  }

  // Deprecated see new addDocument function below
  // addDocument(newDocument: Document) {
  //   if (newDocument == undefined ||newDocument == null) {
  //       return;
  //   }

  //   this.maxDocumentId++;
  //   newDocument.id = this.maxDocumentId.toString();
  //   this.documents.push(newDocument);
  //   // let documentsListClone = this.documents.slice();
  //   // this.documentListChangedEvent.next(documentsListClone);
  //   this.storeDocuments();

  // }

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      );
  }

  // Deprecated see new function below
  // updateDocument(originalDocument: Document, newDocument: Document) {
  //   if (originalDocument == undefined || 
  //       newDocument == undefined || 
  //       originalDocument == null || 
  //       newDocument == null) {
  //       return;
  //   }

  //   let pos = this.documents.indexOf(originalDocument);
  //   if (pos < 0) {
  //       return;
  //   }

  //   newDocument.id = originalDocument.id;
  //   this.documents[pos] = newDocument;
  //   // let documentsListClone = this.documents.slice();
  //   // this.documentListChangedEvent.next(documentsListClone);
  //   this.storeDocuments();
  // }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    // newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      );
  }

  // Deprecated see new function below
  // deleteDocument(document: Document) {
  //   if (!document) {
  //     return;
  //   }
  //   const pos = this.documents.indexOf(document);
  //   if (pos < 0) {
  //     return;
  //   }
  //   this.documents.splice(pos, 1);
  //   // this.documentListChangedEvent.next(this.documents.slice());
  //   this.storeDocuments();
  // }

  deleteDocument(document: Document) {

    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
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
