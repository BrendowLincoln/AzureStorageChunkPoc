import { Component } from '@angular/core';
import {AnonymousCredential, BlobServiceClient, newPipeline } from '@azure/storage-blob';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UploadUriInfo } from './dms.models';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public currentFile: File | null = null;
  public fileSize!: number;
  public currentFileSize: number = 0;

  public txtUri: string = "";

  constructor(private http: HttpClient) {
      this.txtUri = "https://127.0.0.1:10000/devstoreaccount1/dmstemp/f880a78e-6eee-4bb0-8349-9f78d0da793f?sv=2018-03-28&st=2023-03-20T19%3A28%3A38Z&se=2023-03-21T19%3A28%3A38Z&sr=c&sp=racwdl&sig=7k%2BJ%2F09JX%2FdU3feSh5Jm9bVFvKDm%2BxUnpvWElAuszOc%3D";
  }
  
  
  public onFileChange = (event: any) => {
      this.currentFile = event.target.files[0];
      this.update();
  }

  public update = async () => {
      this.fileSize = this.currentFile!.size;

      var sasUri = this.txtUri;
                
      var tempUri = sasUri.split("?", 2)[0];
      var splitted = tempUri.split("/");
      var containerName = splitted[splitted.length-2];
      var filedId = splitted[splitted.length-1];
      sasUri = sasUri.replace(`/${containerName}/`, "").replace(filedId, "");

      const blobServiceClient = new BlobServiceClient(sasUri)
      const containerClient = blobServiceClient.getContainerClient(containerName)
      const client = containerClient.getBlockBlobClient(filedId)
      const response = await client.uploadData(this.currentFile!, {
        blockSize: 3 * 1024 * 1024, // 3GB block size
        concurrency: 20, // 20 concurrency
        onProgress: (progress: any) => {
          this.currentFileSize = progress.loadedBytes;
          console.log(progress.loadedBytes);
        },
        blobHTTPHeaders :{
          blobContentType: 'application/octet-stream',
          blobContentDisposition: 'form-data'
        }
      })

      console.log(response._response.status)
    }
}
