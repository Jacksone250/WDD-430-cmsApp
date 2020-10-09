import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  documents: Document[] = [
    new Document('1','Tigers',"Calvin's Best Friend",'https://www.bing.com/images/search?q=tiger&form=HDRSC3&first=1&scenario=ImageBasicHover', []), 
    new Document('2','Sunsets',"Wow that's pretty!",'https://www.bing.com/images/search?q=sunset&qs=n&form=QBIR&sp=-1&pq=sunset&sc=8-6&cvid=20DED5BD4C0D4ED2B7DD668E18E8541A&first=1&scenario=ImageBasicHover', []),
    new Document('3','WaterFalls','Cool Water Falls','https://www.bing.com/images/search?q=waterfall&qs=n&form=QBIR&sp=-1&ghc=1&pq=waterfall&sc=8-9&cvid=21F79EC073984C5ABA42618ADE390F6B&first=1&scenario=ImageBasicHover', []),
    new Document('4','Space!','Pictures of Space','https://www.bing.com/images/search?q=space&qs=n&form=QBIR&sp=-1&pq=space&sc=8-5&cvid=087AEEFEBD944D85AF67AB68D7179095&first=1&scenario=ImageBasicHover', []),
    new Document('5',"Browning's Best","John Browning's best creation.",'https://www.bing.com/images/search?q=browning%2050%20cal&qs=n&form=QBIR&sp=-1&ghc=2&pq=browning%2050&sc=8-11&cvid=18503421EAA94CDEBA1ABC9CFB6AE77B&first=1&scenario=ImageBasicHover', [])
  ];

  @Output() selectedDocumentEvent = new EventEmitter<Document>(); 

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
