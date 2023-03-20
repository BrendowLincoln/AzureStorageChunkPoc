export class UploadUriInfo {
    public documentId: string = "";
    public url: string =  ""; 


    constructor(documentId: string, url: string) {
        this.documentId = documentId;
        this.url = url
    }
}
