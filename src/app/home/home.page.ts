import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { stringify } from 'querystring';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: any[] = [];

  constructor(private alertCtrl: AlertController, private toastCrtl: ToastController) { }

  async showAdd() {
    const alert = await this.alertCtrl.create({
      header: 'O que deseja fazer?',
      inputs: [
        {
          name: 'taskToDo',
          type: 'text',
          placeholder: 'O que deseja fazer'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Confirmar',
          handler: (form) => {
            console.log('Confirm Ok');
            this.add(form.taskToDo);
          }
        }
      ]
    });

    await alert.present();
  }

  async add(taskToDo: string) {
    if (taskToDo.trim().length < 1) {
      const toast = await this.toastCrtl.create({
        message : 'Informe o que deseja fazer!',
        duration : 2000,
        position : 'middle',
        color : 'danger',
      });
      toast.present();
    }
    let task = {name : taskToDo, done: false}
    this.tasks.push(task);
  }

}
