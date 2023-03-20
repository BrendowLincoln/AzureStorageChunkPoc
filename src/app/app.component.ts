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

  constructor(private http: HttpClient) {}
  
  
  public onFileChange = (event: any) => {
      this.currentFile = event.target.files[0];
      this.update();
  }

  public update = async () => {

      var sasUri = "https://127.0.0.1:10000/devstoreaccount1?sv=2021-10-04&ss=btqf&srt=sco&st=2023-03-20T14%3A29%3A57Z&se=2023-03-21T14%3A29%3A57Z&sp=rwdflacu&sig=UM%2BVScWwyn5%2FXTgAkflm3dft6Tn3wOkU4DLiRd11x70%3D";
    
      const blobServiceClient = new BlobServiceClient(sasUri)
      const containerClient = blobServiceClient.getContainerClient("dmstemp")
      if(!containerClient.exists()){
      console.log("the container does not exit")
      await containerClient.create()

      }
      const client = containerClient.getBlockBlobClient(this.currentFile!.name)
      const response = await client.uploadData(this.currentFile!, {
        blockSize: 3 * 1024 * 1024 * 1024, // 3GB block size
        concurrency: 20, // 20 concurrency
        onProgress: (ev) => console.log(ev),
        blobHTTPHeaders :{ blobContentType:this.currentFile!.type}
      })

      console.log(response._response.status)
    } 
}
