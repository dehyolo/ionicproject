import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';
import { Button } from 'protractor';
import { stringify } from 'querystring';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: any[] = [];

  constructor(private alertCtrl: AlertController, private toastCrtl: ToastController, private actionSheetCrtl: ActionSheetController) { 
    let tasksJSON = localStorage.getItem('tasksDb');

    if(tasksJSON!=null){
      this.tasks = JSON.parse(tasksJSON);
    }

    this.updateLocalStorage();
  }

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

    this.updateLocalStorage();
  }

  updateLocalStorage(){
    localStorage.setItem('tasksDb', JSON.stringify(this.tasks));
  }

  async openActions(task : any){
    const actionSheet = await this.actionSheetCrtl.create({
      header: 'O QUE DESEJA FAZER?',
      buttons: [{
        text : task.done ? 'Desmarcar' : 'Marcar',
        icon : task.done ? 'radio-button-off' : 'checkmark-circle',
        handler: () => {
          task.done = !task.done;
          this.updateLocalStorage();
        }
      },{
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked.')
        }
      }]
    });
    await actionSheet.present();
  }
}
