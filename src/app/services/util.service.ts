import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public loading : HTMLIonLoadingElement;
  isLoading = false;

  constructor(private toastCtrl: ToastController, private loadingCrtl: LoadingController, private alertCtrl: AlertController) { }

  async showToast(message: string, duration: number = 2000) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'middle',
      color: 'danger',
      cssClass: 'animate__animated animate__bounceInRight'
    })
    toast.present();
  }

  async showLoading(message : string = 'Processando'){
    this.isLoading = true;
    let loading = await this.loadingCrtl.create({
      message: message
    })
    this.loading = loading;
    this.loading.present().then(() => {
      //if(!this.isLoading){
        this.loading.dismiss();
      //}
    })
  }

  async hideLoading(){
    this.isLoading = false;
    return await this.loadingCrtl.dismiss();
  }
}
