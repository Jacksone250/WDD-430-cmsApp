export class Document {
    constructor(
        public id: string,
        public name: string,
        public desctription: string,
        public url: string,
        public children: []
    ){ }
}