import { Component } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max'
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  {
  // files: any[] = [];
  file1:any;
  file2:any;
  public imagePath;
  imgURL1: any;
  imgURL2: any;
  // public message1: string;
  // public message2: string;
  waitingResponse = false;
  verifySignResult = -1;
  conf: number = 0;

  constructor(private ng2ImgMax: Ng2ImgMaxService, private httpClient: HttpClient){}
  /**
   * on file drop handler
   */
  onFileDropped($event,imgNo) {
    this.prepareFile($event,imgNo);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(file,imgNo) {
    this.prepareFile(file,imgNo);
  }

  /**
  //  * Delete file from files list
  //  * @param index (File index)
  //  */
  // deleteFile(index: number) {
  //   this.files.splice(index, 1);
  // }

  /**
   * Simulate the upload process
   */
  // uploadFilesSimulator(index: number) {
  //   setTimeout(() => {
  //     if (index === this.files.length) {
  //       return;
  //     } else {
  //       const progressInterval = setInterval(() => {
  //         if (this.files[index].progress === 100) {
  //           clearInterval(progressInterval);
  //           this.uploadFilesSimulator(index + 1);
  //         } else {
  //           this.files[index].progress += 5;
  //         }
  //       }, 200);
  //     }
  //   }, 1000);
  // }

  // /**
  //  * Convert Files list to normal array list
  //  * @param files (Files List)
  //  */
  // prepareFilesList(files: Array<any>) {
  //   for (const item of files) {
  //     item.progress = 0;
  //     this.files.push(item);
  //   }

  //   var mimeType = files[0].type;
  //   if (mimeType.match(/image\/*/) == null) {
  //     this.message1 = "Only images are supported.";
  //     return;
  //   }
 
  //   var reader = new FileReader();
  //   this.imagePath = files;
  //   reader.readAsDataURL(files[0]); 
  //   reader.onload = (_event) => { 
  //     this.imgURL1 = reader.result; 
  //   }

  //   this.uploadFilesSimulator(0);
  // }

  prepareFile(files: Array<any>,imgNo) {
    console.log(!this.imgURL1 || !this.imgURL2)
    this.verifySignResult = -1;
    console.log(files[0])
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.message1 = "Only images are supported.";
      alert("Only images are supported")
      return;
    }

    this.ng2ImgMax.resizeImage(files[0], 224, 224).subscribe(
      result => {
        // this.imgURL1 = result;
        console.log('Resized')
        console.log(result)
        this['file'+imgNo] = result;
        var reader = new FileReader();
        this.imagePath = result;
        reader.readAsDataURL(result); 
        reader.onload = (_event) => { 
          this['imgURL'+imgNo] = reader.result; 
        }
      },
      error => {
        console.log('😢 Oh no!', error);
      }
    );
 
    

    // this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  verifySign(){

    const formData: FormData = new FormData();
    // append image file to it
    formData.append('img1', this.file1);
    formData.append('img2', this.file2);
    // var httpOptions = {
    //     headers: new HttpHeaders({
    //       'Access-Control-Allow-Origin':'*'
    //     })
    // };
    // attach formData (just created above) and httpOptions (created earlier) to post request

    this.waitingResponse = true;
    this.httpClient.post('https://veri-sign-123.herokuapp.com/verifySign', formData)
      .subscribe(
        (response: any) => {
            // resolve(response);
            console.log(response);
            this.verifySignResult = Math.round(response);
            if(Math.round(response) == 1){
              this.conf = Math.round(response * 100) / 100;
            }
            else{
              this.conf = 1 - Math.round(response * 100) / 100;
            }
            this.waitingResponse = false;
        },
        (error: any) => {
            console.log(error);
            this.waitingResponse = false;
            // reject(error);
        });
    

  }
}
