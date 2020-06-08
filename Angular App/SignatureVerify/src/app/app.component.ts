import { Component } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max'
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  {
  file1:any;
  file2:any;
  public imagePath;
  imgURL1: any;
  imgURL2: any;
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
