import { Component } from '@angular/core';
import { BlobServiceClient } from '@azure/storage-blob';
import { HttpClient } from '@angular/common/http';

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

      var sasUri = "https://127.0.0.1:10000/devstoreaccount1/dmstemp/c8761f54-d564-4910-9894-c507e1510ee0?sv=2021-10-04&ss=btqf&srt=sco&st=2023-03-20T14%3A29%3A57Z&se=2023-03-21T14%3A29%3A57Z&sp=rwdflacu&sig=UM%2BVScWwyn5%2FXTgAkflm3dft6Tn3wOkU4DLiRd11x70%3D";
  
      var tempUri = sasUri.split("?", 2)[0];
      var splitted = tempUri.split("/");
      var containerName = splitted[splitted.length-2];
      var filedId = splitted[splitted.length-1];
      sasUri = sasUri.replace(`/${containerName}/`, "").replace(filedId, "");

      const blobServiceClient = new BlobServiceClient(sasUri)
      const containerClient = blobServiceClient.getContainerClient(containerName)
      const client = containerClient.getBlockBlobClient(filedId)
      const response = await client.uploadData(this.currentFile!, { 
        blockSize: 3 * 1024 * 1024 * 1024, // 3GB block size
        concurrency: 20, // 20 concurrency
        onProgress: (ev) => console.log(ev.loadedBytes),
        blobHTTPHeaders :{ 
          blobContentType: 'application/octet-stream',
          blobContentDisposition: 'form-data'
        }
      })

      console.log(response._response.status)
    } 
}
