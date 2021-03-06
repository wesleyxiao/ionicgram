import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

/**
 * Generated class for the CameraPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  image_uri: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private file: File, private transfer: FileTransfer, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
  }

  //open camera and take picture

  takePicture() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.image_uri = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }

  //upload image to server

  uploadImage() {

    //Show loading
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });

    loader.present();

    //create file transfer object
    const fileTransfer: FileTransferObject = this.transfer.create();

    //random int
    var random = Math.floor(Math.random() * 100);

    let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9yZXN0YXBpLmpvbXBocC5jb20iLCJpYXQiOjE1MjY3MDYzNTcsIm5iZiI6MTUyNjcwNjM1NywiZXhwIjoxNTI3MzExMTU3LCJkYXRhIjp7InVzZXIiOnsiaWQiOiIxIn19fQ.O47sS9T6JRj1Ju6qFJ8H4YXUJpxQRoUbLKbheAf8bUs";
    let bearer_token = "Bearer " + token;

    console.log(bearer_token);

    //option transfer
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: "myImage_" + random + ".jpg",
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: "image/jpeg",
      headers: {
        "Authorization": bearer_token
      }
    }

    console.log('image upload started');

    //file transfer action
    fileTransfer.upload(this.image_uri, 'http://restapi.jomphp.com/wp-json/wp/v2/media', options)
      .then((data) => {
        console.log(data);
        console.log("Success");

        //dismiss loader when request finished
        loader.dismiss();

        //show success upload message

        let toast = this.toastCtrl.create({
          message: 'Image was uploaded successfully',
          duration: 1500,
          position: 'bottom'
        });

        toast.present();

        //reset the image that was taken

        this.image_uri = '';

      }, (err) => {
        console.log(err);
        console.log("Error");

        //dismiss loader when request finished
        loader.dismiss();

        //show error upload message

        let toast = this.toastCtrl.create({
          message: err.data.message,
          duration: 1500,
          position: 'bottom'
        });

        toast.present();
      });

  }

}
